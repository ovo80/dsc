import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@rspack/cli'
import { Compilation, sources, type Compiler } from '@rspack/core'
import { createConfig } from '../rspack.config.js'
import { BRAND } from './brand.js'

/** 构建后把 index.html 的 <title> 换成品牌标题，静态首屏就不会闪出旧名字。 */
class BrandTitlePlugin {
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap('BrandTitlePlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'BrandTitlePlugin', stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE },
        () => {
          const asset = compilation.getAsset('index.html')
          if (!asset) {
            return
          }
          const html = asset.source.source().toString()
          compilation.updateAsset(
            'index.html',
            new sources.RawSource(
              html.replace(/<title>[\s\S]*?<\/title>/, `<title>${BRAND.htmlTitle}</title>`)
            )
          )
        }
      )
    })
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** 复用上游的构建配置，只追加品牌入口和标题插件。 */
const config = createConfig({ apiOrigin: BRAND.apiOrigin })

/** 品牌入口先执行，再执行上游入口；两者共用一个 main 产物。 */
config.entry = { main: ['./custom/entry.ts', './src/main.tsx'] }
config.context = root
config.plugins = [...(config.plugins ?? []), new BrandTitlePlugin()]

// eslint-disable-next-line import/no-default-export
export default defineConfig(config)
