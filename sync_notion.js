const { Client } = require('@notionhq/client');
const fs = require('fs');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function fetchNavData() {
  try {
    const links = [];
    let hasMore = true;
    let cursor = undefined;

    console.log("正在从 Notion 搬运全量数据...");

    // 使用循环抓取所有页面的数据
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor, // 从上次结束的地方开始
        filter: {
          property: "status",
          select: { equals: "Published" }
        }
      });

      // 将当前页面的结果加入数组
      for (const page of response.results) {
        const prop = page.properties;
        // ... (这里保留你原来的 1. 到 5. 的解析逻辑) ...
        const titleObj = prop.title || prop.Name;
        const title = titleObj?.title?.[0]?.plain_text || "";
        const url = prop.url?.url || "";

        if (!title || !url) continue;

        const categoryName = prop.category?.select?.name || "默认分类";
        
        // (省略中间的图标抓取逻辑，保持你原来的代码即可)
        
        links.push({
          title: title,
          desc: prop.summary?.rich_text?.[0]?.plain_text || "...",
          url: url,
          logo: iconUrl, // 确保 iconUrl 变量在循环内已定义
          category: categoryName
        });
      }

      // 更新分页状态
      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    // 分类汇总
// 1. 获取数据库元数据
    const dbMetadata = await notion.databases.retrieve({ database_id: databaseId });
    
    // 2. 这里的属性名必须和你 Notion 里的叫法完全一致，如果是中文就写 "category"
    const categoryProperty = dbMetadata.properties['category'] || dbMetadata.properties['分类']; 
    const categoryOptions = categoryProperty?.select?.options || [];
    
    // 打印一下，方便你在 GitHub Actions 的日志里看到排序到底对不对
    const orderedCategories = categoryOptions.map(opt => opt.name);
    console.log("Notion 中的分类排序顺序为:", orderedCategories);

    // 3. 提取当前链接中涉及的所有分类
    const existingCategories = Array.from(new Set(links.map(l => l.category)));

    // 4. 强制按照 Notion 后台拖拽的顺序进行重排
    const finalSortOrder = orderedCategories.filter(cat => existingCategories.includes(cat));
    
    // 补齐逻辑：如果有些分类不在选项里，放到最后
    existingCategories.forEach(cat => {
      if (!finalSortOrder.includes(cat)) finalSortOrder.push(cat);
    });

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
