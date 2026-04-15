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
        select: { equals: "Published" } // 👈 关键点：专门适配你截图里的“单选”属性
      }
    });

    for (const page of response.results) {
      const prop = page.properties;
      
      // 检查标题和链接是否存在
      const title = prop.title?.title[0]?.plain_text || prop.Name?.title[0]?.plain_text;
      const url = prop.url?.url;

      if (!title || !url) continue;

      let iconUrl = ""; 
      if (page.icon) {
        iconUrl = page.icon.type === 'emoji' ? '' : (page.icon.external?.url || page.icon.file?.url);
      }

      links.push({
        title: title,
        desc: prop.summary?.rich_text[0]?.plain_text || "",
        url: url,
        logo: iconUrl || "https://cunzhangblog.com/favicon.png",
        category: prop.category?.select?.name || "默认分类"
      });
    }

    const categories = Array.from(new Set(links.map(l => l.category)));
    const formattedData = categories.map(cat => ({
      taxonomy: cat,
      links: links.filter(l => l.category === cat)
    }));

    // 确保 src 文件夹存在
    if (!fs.existsSync('./src')) { fs.mkdirSync('./src'); }
    
    fs.writeFileSync('./src/webstack.json', JSON.stringify(formattedData, null, 2));
    console.log(`✅ 同步成功！搬运了 ${links.length} 个网站。`);
  } catch (error) {
    console.error("❌ 同步依然失败，错误详情：");
    console.error(error.message);
    process.exit(1);
  }
}

fetchNavData();
