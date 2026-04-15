const { Client } = require('@notionhq/client');
const fs = require('fs');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function fetchNotionData() {
  const links = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      filter: {
        property: "status", // 只抓取已发布的
        status: { equals: "Published" }
      }
    });

    response.results.forEach(page => {
      const prop = page.properties;
      links.push({
        title: prop.title?.title[0]?.plain_text || "无标题",
        desc: prop.summary?.rich_text[0]?.plain_text || "点击查看详情",
        url: page.url, // 这里默认指向Notion页面，如果你有外部URL字段可以替换
        logo: "https://cunzhangblog.com/favicon.png", // 建议设个默认Logo
        category: prop.category?.select?.name || "未分类"
      });
    });

    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }

  // 转换成 WebStack 要求的分组格式
  const formattedData = Array.from(new Set(links.map(l => l.category))).map(cat => ({
    taxonomy: cat,
    links: links.filter(l => l.category === cat)
  }));

  fs.writeFileSync('./src/webstack.json', JSON.stringify(formattedData, null, 2));
  console.log('✅ 数据同步成功，已更新 webstack.json');
}

fetchNotionData();