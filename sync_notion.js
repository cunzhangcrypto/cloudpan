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
      
      // 1. 安全地获取标题 (兼容 Name 或 title)
      const titleObj = prop.title || prop.Name;
      const title = titleObj?.title?.[0]?.plain_text || "";
      
      // 2. 安全地获取 URL
      const url = prop.url?.url || "";

      // 如果连标题或链接都没有，直接跳过这一行
      if (!title || !url) {
        console.log(`跳过无效数据: ${title || '无标题'}`);
        continue;
      }

      // 3. 安全地获取上传的图标 (page.icon)
      let iconUrl = ""; 
      if (page.icon) {
        if (page.icon.type === 'external') {
          iconUrl = page.icon.external.url;
        } else if (page.icon.type === 'file') {
          iconUrl = page.icon.file.url; 
        }
      }

      // 4. 安全地获取分类
      const category = prop.category?.select?.name || "默认分类";

      links.push({
        title: title,
        desc: prop.summary?.rich_text?.[0]?.plain_text || "",
        url: url,
        logo: iconUrl, // 这里保持为空字符串，不加那个错误域名链接
        category: category
      });
    }

    // 分类汇总逻辑
    const categories = Array.from(new Set(links.map(l => l.category)));
    const formattedData = categories.map(cat => ({
      taxonomy: cat,
      links: links.filter(l => l.category === cat)
    }));

    if (!fs.existsSync('./src')) { fs.mkdirSync('./src'); }
    
    fs.writeFileSync('./src/webstack.json', JSON.stringify(formattedData, null, 2));
    console.log(`✅ 同步成功！搬运了 ${links.length} 个网站。`);
  } catch (error) {
    // 这里会打印出具体的错误原因，方便排查
    console.error("❌ 脚本运行出错，具体原因：", error.message);
    process.exit(1);
  }
}

fetchNavData();
