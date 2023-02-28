import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import {scalajs, production} from "./target/scalajs.rollup.config"
import postcss from "rollup-plugin-postcss"
import url from "postcss-url"

const assetOptions = [
    // maxSize is kilobytes
    { filter: "**/*.png", url: "inline", maxSize: 48, fallback: "copy", assetsPath: "img", useHash: true }
]

const config = {
    plugins: [
        postcss({
            extract: true,
            minimize: production,
            plugins: [ url(assetOptions) ],
            to: scalajs.output.dir + "/unused.css" // last path part is unused
        }),
        resolve(), // tells Rollup how to find date-fns in node_modules
        commonjs(), // converts date-fns to ES modules
        production && terser() // minify, but only in production
    ],
    context: "window" // silences nonsense rollup build time error message
}

export default Object.assign({}, scalajs, config)
