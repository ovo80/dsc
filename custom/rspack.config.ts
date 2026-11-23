import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@rspack/cli'
import { Compilation, CopyRspackPlugin, sources, type Compiler } from '@rspack/core'
import { createConfig } from '../rspack.config.js'
import { BRAND } from './brand.js'

/** 构建后替换 index.html 的标题并注入站点图标，静态首屏就是品牌样式。 */
class BrandHtmlPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap('BrandHtmlPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'BrandHtmlPlugin', stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE },
        () => {
          const asset = compilation.getAsset('index.html')
          if (!asset) {
            return
          }
          const html = asset.source.source().toString()
          const next = html
            .replace(/<title>[\s\S]*?<\/title>/, `<title>${BRAND.htmlTitle}</title>`)
            .replace(
              /<\/head>/,
              '<link rel="icon" type="image/png" sizes="128x128" href="favicon.png">' +
                '<link rel="apple-touch-icon" href="favicon.png"></head>'
            )
          compilation.updateAsset('index.html', new sources.RawSource(next))
        }
      )
    })
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** 复用上游的构建配置，只追加品牌入口、标题、图标和静态资源。 */
const config = createConfig({ apiOrigin: BRAND.apiOrigin })

/** 品牌入口先执行，再执行上游入口；两者共用一个 main 产物。 */
config.entry = { main: ['./custom/entry.ts', './src/main.tsx'] }
config.context = root
config.plugins = [
  ...(config.plugins ?? []),
  new BrandHtmlPlugin(),
  new CopyRspackPlugin({
    patterns: [{ from: path.resolve(root, 'custom/favicon.png'), to: 'favicon.png' }],
  }),
]

// eslint-disable-next-line import/no-default-export
export default defineConfig(config)
