import {createFilter} from "@rollup/pluginutils"
import autoprefixer from "autoprefixer"
import cssnanoPlugin from "cssnano"
import postcss from "postcss"
import postcssUrl from "postcss-url"
import fs from "fs"

export default function rollupPostcss(options = {}, urlOptions = {}) {
    const filter = createFilter(options.include || "**/*.css", options.exclude)
    const isProd = options.production === true
    const basicPlugins = [autoprefixer, postcssUrl(urlOptions)]
    const extraPlugins = isProd ? [cssnanoPlugin()] : []
    const plugins = basicPlugins.concat(extraPlugins)
    return {
        name: "rollup-postcss",
        async buildStart(opts) {
            // console.log(`Build start ${JSON.stringify(opts)}`)
            await fs.rm(options.to, () => true)
        },
        async buildEnd(err) {
            // console.log("Build complete.")
        },
        // async resolveId(source) {
        //   console.log(`Resolve ${source}`)
        // },
        async transform(code, id) {
            // console.log(`Transform ${id}`)
            if (!filter(id)) return
            const result = await postcss(plugins)
                .process(code, {from: id, to: options.to})
            // console.log(`Processed ${id} to ${options.to}`)
            await fs.appendFile(options.to, result.css, () => true)
            return {code: "", map: undefined}
        },
        async writeBundle(opts, bundle) {
            // console.log(`Write bundle ${JSON.stringify(opts)}`)
        }
    }
}
