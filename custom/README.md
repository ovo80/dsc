# custom — 定制覆盖层

所有对本项目的定制都放在这个目录里，上游 `src/` 一行不改。同步上游时直接 rebase，
不会和你的改动冲突。

## 目录

| 文件               | 作用                                                      |
| ------------------ | --------------------------------------------------------- |
| `brand.ts`         | 唯一的品牌数据源：应用名、页面标题、API 地址              |
| `entry.ts`         | 品牌入口：在 React 渲染前覆盖 i18n 文案和页面标题         |
| `rspack.config.ts` | 继承上游 `createConfig`，追加品牌入口、标题和图标         |
| `favicon.png`      | 站点图标，构建时复制到 `dist/favicon.png` 并注入 `<link>` |

## 改名字

只改 `brand.ts` 里的 `appName` 和 `htmlTitle`，然后重新构建：

```sh
pnpm build
```

## 换 API 地址

改 `brand.ts` 里的 `apiOrigin`。开发时也可以在上游 `createConfig` 的 `devServer`
里配代理。

## 换主题色

新建 `custom/brand.css`，覆盖 `theme.css` 里的 CSS 变量，然后在 `entry.ts` 里
`import './brand.css'` 即可，不用改上游样式文件。

## 换图标

替换 `custom/favicon.png`（建议 128×128 透明底 PNG），重新构建即可。构建会把它复制到
`dist/favicon.png`，并往 `index.html` 注入 favicon 和 apple-touch-icon 的 `<link>`。

## 同步上游

```sh
git fetch upstream --tags
git rebase upstream/main
```

## 改 UI 结构 / 加功能

覆盖层管不了这些。改完上游文件后，把 diff 固化成补丁放进 `patches/`：

```sh
git diff upstream/main -- src > patches/ui.patch
# 同步上游后重新应用
git apply patches/ui.patch
```
