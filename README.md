# 村长 AI 工具箱 - 基于 Notion 的自动化网址导航

本项目是一个自动化、响应式的在线网址导航工具，采用 **Notion + GitHub Actions + Cloudflare Pages** 的架构实现。通过 Notion 数据库管理内容，实现“一次修改，全网同步”。

## 🔗 在线预览

- **正式版**: [https://www.cunzhangai.com](https://www.cunzhangai.com)

## 项目特点

- **Notion 后台管理**：无需修改代码，直接在 Notion 页面中添加或修改链接即可实时更新。
- **自动化部署**：通过 GitHub Actions 定时或触发式拉取 Notion 数据，生成静态页面。
- **极致速度**：托管于 Cloudflare Pages 全球 CDN，极速访问，永不宕机。
- **响应式设计**：完美适配手机、平板及 PC 端。
- **完全免费**：所使用的 Notion、GitHub 和 Cloudflare 服务均为免费额度。

## 快速开始

### 1. 准备工作
- **Notion 模板**：复制一份项目配套的 Notion 数据库模板。
- **获取 Integration Token**：在 Notion 开发者平台创建一个内部集成并获取 Token。
- **获取 Database ID**：在 Notion 数据库页面 URL 中找到长字符串 ID。

### 2. 部署步骤
1. **Fork 本仓库** 到你自己的 GitHub 账号。
2. **设置 GitHub Secrets**：
   - 进入仓库的 `Settings` -> `Secrets and variables` -> `Actions`。
   - 添加 `NOTION_TOKEN`：你的 Notion 机器人密钥。
   - 添加 `NOTION_DATABASE_ID`：你的数据库 ID。
3. **配置 Cloudflare Pages**：
   - 在 Cloudflare 后台连接你的 GitHub 仓库。
   - 构建设置中，“构建命令”留空，“输出目录”设置为 `./`。

## 项目结构
- `index.html`：导航主页面。
- `assets/`：存放 CSS 样式、JavaScript 逻辑及图片资源。
- `scripts/`：包含与 Notion API 交互同步数据的脚本。

## 常见问题
- **页面不更新**：请检查 GitHub Actions 的运行日志，确认 Notion Token 及 Database ID 配置是否正确。
- **样式报错**：由于脚本执行顺序，请确保在 Notion 数据库中正确配置了 `category` 字段。

## 许可证
基于 MIT License 开源。

## 🌐 关于作者与交流

本项目由 **Web3村长** 维护，专注于分享 AI 效率工具、副业变现及 Web3 技术干货。如果你对 AIGC 自动化或导航站建设有疑问，欢迎通过以下方式联系：

* **个人博客**: [Web3村长｜AI工具 & 副业](https://www.cunzhangblog.com/) —— 深度长文与资源汇总。
* **YouTube 频道**: [@cunzhangcrypto](https://www.youtube.com/@cunzhangcrypto) —— 实操视频教学，同步更新。
* **Telegram 频道**: [@cunzhangcrypto](https://t.me/cunzhangcrypto) —— 实时资源与工具分享。
* **项目归属**: 本项目为 **村长AI工具箱** 的开源版本。

---
**关键词 (SEO Keywords):** AI 导航站, Notion 导航模板, Cloudflare Pages 部署, Web3村长, AI 效率工具, 自动更新导航, 个人博客 SEO

## 📝 致谢与二次开发说明

本项目基于原作者 [geeeeeeeek](https://github.com/geeeeeeeek) 的开源项目 [web_tool](https://github.com/geeeeeeeek/web_tool) 进行二次开发。

**主要修改内容：**
- 接入了 **Notion API** 实现了数据的自动化管理与同步。
- 适配了 **GitHub Actions** 与 **Cloudflare Pages** 的自动化部署流程。
- 优化了 SEO 关键词及个人品牌展示。
- 移除了部分冗余挂件，提升了页面加载速度。

感谢原作者提供的优秀 UI 框架与设计灵感。