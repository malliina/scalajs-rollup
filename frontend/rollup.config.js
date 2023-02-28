import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import {scalajs, production, outputDir} from "./target/scalajs.rollup.config"
import postcss from "rollup-plugin-postcss"
import cssUrl from "postcss-url"
import url from "@rollup/plugin-url"

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

const config = [
    {
        input: scalajs.input,
        plugins: [
            postcss({
                extract: true,
                minimize: production,
                plugins: [cssUrl(cssOptions)],
                to: scalajs.output.dir + "/unused.css" // last path part is unused
            }),
            resolve(), // tells Rollup how to find date-fns in node_modules
            commonjs(), // converts date-fns to ES modules
            production && terser() // minify, but only in production
        ],
        output: {
            dir: outputDir,
            format: "iife",
            name: "version",
            entryFileNames: entryNames
        },
        context: "window" // silences nonsense rollup build time error message
    },
    {
        input: {
            fonts: "src/main/resources/assets.js"
        },
        plugins: [
            url({
                limit: 0,
                fileName: production ? "[dirname][name].[hash][extname]" : "[dirname][name][extname]"
            }),
            postcss({
                extract: true,
                minimize: production,
                plugins: [cssUrl(cssOptions)]
            }),
            production && terser()
        ],
        output: {
            dir: outputDir,
            format: "iife",
            entryFileNames: entryNames
        },
        context: "window"
    }
]

export default config
