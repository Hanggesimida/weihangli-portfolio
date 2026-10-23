# Weihang Li — 个人作品集网站

基于 Next.js App Router 构建的单页作品集站点，展示 **Weihang Li**（全栈开发者）的介绍。页面包含首屏、服务、精选作品、关于与联系等区块，并配合滚动与动效。

**其他语言：** [English](README.md)

## 功能概览

- 按区块组织的落地页（首屏、我能做什么、精选作品、关于、联系、页脚）
- 带配图与滚动联动的项目卡片
- 平滑滚动（Lenis）与动画（Motion）
- 联系表单提交到服务端路由，并通过 [Resend](https://resend.com) 发送邮件

## 技术栈

- **框架：** Next.js 16（App Router）、React 19、TypeScript
- **样式：** Tailwind CSS 4
- **UI：** Lucide 图标、clsx / tailwind-merge；自研 Spinner、RollingText、微信悬停面板
- **动效：** Motion
- **滚动：** Lenis
- **表单：** react-hook-form
- **邮件：** Resend
## 环境要求

- **Node.js** — 建议使用当前的 **LTS** 版本（与 Next.js 16 常见要求一致）。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。编辑 `src/` 下的文件即可，开发模式下支持热更新。

### 脚本说明

| 命令           | 说明           |
| -------------- | -------------- |
| `npm run dev`  | 启动开发服务器 |
| `npm run build` | 生产构建      |
| `npm run start` | 运行生产服务  |
| `npm run lint`  | 运行 ESLint   |

## 环境变量

联系表单对应的后端接口在 [`src/app/api/send/route.ts`](src/app/api/send/route.ts) 中使用 Resend。

- **`RESEND_API_KEY`** — 从 API 路由发信所必需。请在本地（例如 `.env.local`）以及生产与预览部署环境的托管平台中配置。
- **`CONTACT_FROM_EMAIL`**（可选）— 发件人，例如 `Weihang Li <hello@your-domain.com>`，需为 Resend 已验证域名；默认 `onboarding@resend.dev`。
- **`CONTACT_TO_EMAIL`**（可选）— 收件邮箱，默认取 `src/config/site.ts` 中的 `CONTACT_EMAIL`。
- **`NEXT_PUBLIC_SITE_URL`**（可选）— 站点正式域名，用于 SEO 元数据、sitemap 与 robots，默认 `https://weihangli.dev`。

请在 Resend 控制台完成发信域名验证，并将 `CONTACT_FROM_EMAIL` 设置为该域名下的地址。切勿将真实 API 密钥提交到仓库。

## 部署

可部署到任意支持 Next.js 的平台（例如 [Vercel](https://vercel.com)）。在项目环境变量中配置 `RESEND_API_KEY`。

- [Next.js 官方文档 — 部署](https://nextjs.org/docs/app/building-your-application/deploying)

## 许可

私有项目（`package.json` 中 `"private": true`）。
