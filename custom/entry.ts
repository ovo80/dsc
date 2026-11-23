import { en } from '../src/i18n/en.js'
import { zh } from '../src/i18n/zh.js'
import { BRAND } from './brand.js'

/**
 * 品牌入口：在 React 渲染前把品牌文案覆盖到 i18n 字典上。
 *
 * i18n 的 translators 保存的是 zh / en 对象的引用，translate() 调用时才读取属性，
 * 所以这里改属性即可生效，不需要修改上游的 src/i18n/*.ts。
 *
 * zh 是 `as const` 的只读对象，用 Object.assign 在运行时覆盖，绕开只读类型检查。
 */
Object.assign(zh, { appName: BRAND.appName })
Object.assign(en, { appName: BRAND.appName })

document.title = BRAND.htmlTitle
