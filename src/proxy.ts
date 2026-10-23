// 路由拦截器，这是国际化的入口。它在页面渲染前执行，处理 URL 的重定向和语言分发。
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// 创建中间件，它会自动处理：如果是 /zh-CN 则设置语言为中文
export default createMiddleware(routing);

export const config = {
  // 匹配器：排除 api 路由、静态文件（_next, favicon.ico 等）
  // 只有正常的页面路径才会经过国际化中间件处理
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)"],
};
