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

    // --- 核心修复：分页循环 ---
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        filter: {
          property: "status",
          select: { equals: "Published" } 
        }
      });

      for (const page of response.results) {
        const prop = page.properties;
        
        const titleObj = prop.title || prop.Name;
        const title = titleObj?.title?.[0]?.plain_text || "";
        const url = prop.url?.url || "";

        if (!title || !url) continue;

        const categoryName = prop.category?.select?.name || "默认分类";

        // --- 修复 iconUrl 定义问题 ---
        let iconUrl = ""; 
        if (page.icon) {
          if (page.icon.type === 'external') {
            iconUrl = page.icon.external.url;
          } else if (page.icon.type === 'file') {
            iconUrl = page.icon.file.url; 
          }
        }

        if (!iconUrl && prop.icon) {
          iconUrl = prop.icon.rich_text?.[0]?.plain_text || prop.icon.url || "";
        }

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

      // 更新分页参数
      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    // --- 分类汇总与排序逻辑 ---
    const dbMetadata = await notion.databases.retrieve({ database_id: databaseId });
    const categoryProperty = dbMetadata.properties['category'] || dbMetadata.properties['分类']; 
    const categoryOptions = categoryProperty?.select?.options || [];
    const orderedCategories = categoryOptions.map(opt => opt.name);
    
    console.log("Notion 中的分类排序顺序为:", orderedCategories);

    const existingCategories = Array.from(new Set(links.map(l => l.category)));
    const finalSortOrder = orderedCategories.filter(cat => existingCategories.includes(cat));
    
    existingCategories.forEach(cat => {
      if (!finalSortOrder.includes(cat)) finalSortOrder.push(cat);
    });

    const formattedData = finalSortOrder.map(cat => ({
      taxonomy: cat,
      links: links.filter(l => l.category === cat)
    }));

    if (!fs.existsSync('./src')) { fs.mkdirSync('./src'); }
    fs.writeFileSync('./src/webstack.json', JSON.stringify(formattedData, null, 2));
    
    console.log(`✅ 同步成功！总共搬运了 ${links.length} 个网站。`);
  } catch (error) {
    console.error("❌ 脚本运行出错，具体原因：", error.message);
    process.exit(1);
  }
}

fetchNavData();
