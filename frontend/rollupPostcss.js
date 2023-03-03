import {createFilter} from "@rollup/pluginutils"
import autoprefixer from "autoprefixer"
import cssnanoPlugin from "cssnano"
import path from "path"
import postcss from "postcss"
import postcssUrl from "postcss-url"
import postcssNesting from "postcss-nesting"

// Inspiration from https://github.com/egoist/rollup-plugin-postcss/blob/master/src/index.js

function importOrder(id, getInfo) {
  return getInfo(id).importedIds.flatMap(imported => {
    return [imported].concat(importOrder(imported, getInfo))
  }).filter((v, idx, arr) => arr.indexOf(v) === idx)
}

export default function rollupPostcss(options = {}, urlOptions = {}) {
  const filter = createFilter(options.include || "**/*.css", options.exclude)
  const minimize = options.minimize || false
  const basicPlugins = [postcssNesting(), autoprefixer, postcssUrl(urlOptions)]
  const extraPlugins = minimize ? [cssnanoPlugin()] : []
  const plugins = basicPlugins.concat(extraPlugins)
  const processed = new Map()
  return {
    name: "rollup-plugin-extract-postcss",
    async transform(code, id) {
      if (!filter(id)) return
      const result = await postcss(plugins)
        .process(code, {from: id, to: path.resolve(options.outDir, "unused.css")})
      processed.set(id, result.css)
      return {code: "", map: undefined}
    },
    augmentChunkHash(chunkInfo) {
      // JSON stringifies a Map. Go JavaScript.
      const ids = importOrder(chunkInfo.facadeModuleId, this.getModuleInfo)
      const obj = Array.from(processed).reduce((obj, [key, value]) => {
        if (ids.includes(key)) {
          obj[key] = value
        }
        return obj
      }, {})
      return JSON.stringify(obj)
    },
    async generateBundle(opts, bundle) {
      if (processed.size === 0) return
      const entries = Object.keys(bundle).filter(fileName => bundle[fileName].isEntry)
      entries.forEach(entry => {
        const facade = bundle[entry].facadeModuleId
        const orderedIds = importOrder(facade, this.getModuleInfo)
        const contents = orderedIds.map(id => processed.get(id))
        const content = "".concat(...contents)
        const name = path.parse(entry).name
        // console.log(`Writing bundle for ${entry}, files are ${orderedIds}`)
        const ref = this.emitFile({
          fileName: `${name}.css`,
          type: "asset",
          source: content
        })
        console.log(`Created ${this.getFileName(ref)}.`)
      })
    }
  }
}
