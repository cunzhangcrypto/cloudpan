# AI Toolset - Notion-Powered Web Navigation

This is an automated, responsive web navigation tool built with **Notion + GitHub Actions + Cloudflare Pages**. Manage your content via a Notion database and sync updates effortlessly.

## 🔗 Live Demo

- **正式版**: [https://www.cunzhangai.com](https://www.cunzhangai.com)

## Features

- **Notion Backend**: Update your website content by simply editing a Notion page—no coding required.
- **Automated Deployment**: GitHub Actions fetches data from Notion API and builds static pages automatically.
- **High Performance**: Hosted on Cloudflare Pages with global CDN for lightning-fast speeds.
- **Responsive UI**: Fully optimized for mobile, tablet, and desktop viewing.
- **Zero Cost**: Built entirely using the free tiers of Notion, GitHub, and Cloudflare.

## Getting Started

### 1. Prerequisites
- **Notion Template**: Duplicate the project's Notion database template.
- **Integration Token**: Create an internal integration in the Notion Developer Portal to get your Token.
- **Database ID**: Locate the unique ID string in your Notion database URL.

### 2. Deployment
1. **Fork this repository** to your own GitHub account.
2. **Configure GitHub Secrets**:
   - Go to `Settings` -> `Secrets and variables` -> `Actions`.
   - Add `NOTION_TOKEN`: Your Notion Integration Secret.
   - Add `NOTION_DATABASE_ID`: Your Notion Database ID.
3. **Connect to Cloudflare Pages**:
   - Connect your GitHub repo in the Cloudflare dashboard.
   - Build Settings: Leave "Build command" empty; set "Output directory" to `./`.

## Project Structure
- `index.html`: Main navigation interface.
- `assets/`: Directory for CSS, JS, and image assets.
- `scripts/`: Scripts for syncing Notion data via API.

## FAQ
- **Site not updating?**: Check the GitHub Actions logs to verify your Secrets are correctly configured.
- **Initialization Errors**: Ensure the `category` field in your Notion database is properly formatted.

## 🌐 Contact & Support

Maintained by **Web3 Cunzhang**, focusing on AI productivity tools and Web3 insights.

* **Blog**: [Web3 Cunzhang | AI & Side Hustle](https://www.cunzhangblog.com/)
* **YouTube**: [@cunzhangcrypto](https://www.youtube.com/@cunzhangcrypto)
* **Telegram**: [@cunzhangcrypto](https://t.me/cunzhangcrypto)

---
**Keywords:** AI Navigation, Notion Template, Cloudflare Pages Deployment, Web3, Productivity Tools.

## 📝 Credits & Secondary Development

This project is a secondary development based on the original open-source project [web_tool](https://github.com/geeeeeeeek/web_tool) by [geeeeeeeek](https://github.com/geeeeeeeek).

**Key Enhancements:**
- **Notion API Integration**: Implemented automated data management and synchronization.
- **Automated Workflow**: Configured seamless deployment using **GitHub Actions** and **Cloudflare Pages**.
- **SEO Optimization**: Enhanced keywords and personal branding for better search engine visibility.
- **Performance Tuning**: Removed redundant widgets and optimized page load speeds.

Deep gratitude to the original author for providing the excellent UI framework and design inspiration.