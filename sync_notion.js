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
      
      const title = prop.title?.title[0]?.plain_text || prop.Name?.title[0]?.plain_text;
      const url = prop.url?.url;

      if (!title || !url) continue;

      // --- 修改后的图标抓取逻辑 ---
      let iconUrl = ""; 
      if (page.icon) {
        if (page.icon.type === 'external') {
          iconUrl = page.icon.external.url;
        } else if (page.icon.type === 'file') {
          iconUrl = page.icon.file.url; // 这里就是抓取你“上传”的图片
        }
      }

      links.push({
        title: title,
        desc: prop.summary?.rich_text[0]?.plain_text || "",
        url: url,
        // 这里删掉了那个强制的域名链接，如果没有图就给空
        logo: iconUrl, 
        category: prop.category?.select?.name || "默认分类"
      });
    }

    const categories = Array.from(new Set(links.map(l => l.category)));
    const formattedData = categories.map(cat => ({
      taxonomy: cat,
      links: links.filter(l => l.category === cat)
    }));

    if (!fs.existsSync('./src')) { fs.mkdirSync('./src'); }
    
    fs.writeFileSync('./src/webstack.json', JSON.stringify(formattedData, null, 2));
    console.log(`✅ 同步成功！搬运了 ${links.length} 个网站。`);
  } catch (error) {
    console.error("❌ 同步失败：", error.message);
    process.exit(1);
  }
}

fetchNavData();
