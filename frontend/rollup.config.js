import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import url from "@rollup/plugin-url"
import {scalajs, production, outputDir} from "./target/scalajs.rollup.config.js"
import rollupPostcss from "./rollupPostcss"
import path from "path"

const cssOptions = [
    {
        filter: "**/*.woff2",
        url: "inline"
    },
    // maxSize is kilobytes
    {
        filter: "**/*.png",
        url: "inline",
        maxSize: 48,
        fallback: "copy",
        assetsPath: "img",
        useHash: production,
        hashOptions: {append: true}
    }
]

const entryNames = production ? "[name].[hash].js" : "[name].js"

const cssPlugin = (out) => rollupPostcss({
    to: path.resolve(outputDir, out),
    production: production
}, cssOptions)

const cssConfig = (inputConfig, out) => {
    return {
        input: inputConfig,
        plugins: [
            url({
                limit: 0,
                fileName: production ? "[dirname][name].[hash][extname]" : "[dirname][name][extname]"
            }),
            cssPlugin(out),
            production && terser()
        ],
        output: {
            dir: outputDir,
            entryFileNames: entryNames
        }
    }
}

const config = [
    {
        input: scalajs.input,
        plugins: [
            cssPlugin("frontend.css"),
            resolve(), // tells Rollup how to find date-fns in node_modules
            commonjs(), // converts date-fns to ES modules
            production && terser() // minify, but only in production
        ],
        output: {
            dir: outputDir,
            format: "iife",
            name: "version",
            entryFileNames: entryNames
        }
    },
    cssConfig({fonts: "src/main/resources/assets.js"}, "fonts.css"),
    cssConfig({styles: "src/main/resources/styles.js"}, "styles.css")
]

export default config
