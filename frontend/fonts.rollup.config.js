import terser from "@rollup/plugin-terser"
import {scalajs, production} from "./target/scalajs.rollup.config"
import postcss from "rollup-plugin-postcss"
import url from "postcss-url"

const assetOptions = [
    { filter: "**/*.woff2", url: "inline" }
];

const config = {
    input: {
      fonts: "src/main/resources/fonts/fonts.js"
    },
    plugins: [
        postcss({extract: true, minimize: production, plugins: [
            url(assetOptions)
        ]}),
        production && terser() // minify, but only in production
    ],
    output: scalajs.output,
    context: "window" // silences nonsense rollup build time error message
}

export default Object.assign({}, config)
