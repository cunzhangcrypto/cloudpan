const { Client } = require('@notionhq/client');
const fs = require('fs');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function fetchNavData() {
  try {
    const links = [];
    console.log("正在从 Notion 搬运数据...");
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "status",
        select: { equals: "Published" } 
      }
    });

    for (const page of response.results) {
      const prop = page.properties;
      
      // 1. 安全获取标题和URL
      const titleObj = prop.title || prop.Name;
      const title = titleObj?.title?.[0]?.plain_text || "";
      const url = prop.url?.url || "";

      if (!title || !url) continue;

      // 2. 先定义好分类变量 (修复报错的关键)
      const categoryName = prop.category?.select?.name || "默认分类";

      // 3. 抓取图标逻辑
      let iconUrl = ""; 
      if (page.icon) {
        if (page.icon.type === 'external') {
          iconUrl = page.icon.external.url;
        } else if (page.icon.type === 'file') {
          iconUrl = page.icon.file.url; 
        }
      }

      // 4. 尝试读取表格里的 icon 列
      if (!iconUrl && prop.icon) {
        iconUrl = prop.icon.rich_text?.[0]?.plain_text || prop.icon.url || "";
      }

      // 5. 最终兜底
      if (!iconUrl || iconUrl.trim() === "") {
        iconUrl = "assets/images/favicon.png"; 
      }

      links.push({
        title: title,
        desc: prop.summary?.rich_text?.[0]?.plain_text || "...",
        url: url,
        logo: iconUrl,
        category: categoryName
      });
    }

    // 分类汇总
// 1. 获取 Notion 数据库的属性定义（包含你手动调好的选项顺序）
    const dbMetadata = await notion.databases.retrieve({ database_id: databaseId });
    const categoryOptions = dbMetadata.properties.category?.select?.options || [];
    const orderedCategories = categoryOptions.map(opt => opt.name);

    // 2. 获取当前搬运回来的所有分类
    const existingCategories = Array.from(new Set(links.map(l => l.category)));

    // 3. 按照 Notion 后台“手动排序”的顺序进行排列
    const finalSortOrder = orderedCategories.filter(cat => existingCategories.includes(cat));
    
    // 如果有新分类没在选项列表里（兜底逻辑），补在最后
    existingCategories.forEach(cat => {
      if (!finalSortOrder.includes(cat)) finalSortOrder.push(cat);
    });

    // 4. 生成最终的格式化数据
    const formattedData = finalSortOrder.map(cat => ({
      taxonomy: cat,
      links: links.filter(l => l.category === cat)
    }));

    if (!fs.existsSync('./src')) { fs.mkdirSync('./src'); }
    fs.writeFileSync('./src/webstack.json', JSON.stringify(formattedData, null, 2));
    
    console.log(`✅ 同步成功！搬运了 ${links.length} 个网站。`);
  } catch (error) {
    console.error("❌ 脚本运行出错，具体原因：", error.message);
    process.exit(1);
  }
}

fetchNavData();
