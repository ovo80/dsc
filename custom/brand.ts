/**
 * 品牌与站点配置：所有定制集中在这个文件里。
 * 改名字、换 API 地址只需要动这里，上游源码一行都不用改，同步上游时不会冲突。
 */
export const BRAND = {
  /** 侧边栏、设置里显示的应用名 */
  appName: 'Oh My DSC',
  /** 浏览器标签页标题，也是构建产物 index.html 的 <title> */
  htmlTitle: 'Oh My DSC',
  /** API 服务地址；换成自建或代理服务时改这里 */
  apiOrigin: 'https://api.deepseek.com',
} as const
