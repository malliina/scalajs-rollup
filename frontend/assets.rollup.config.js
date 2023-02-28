import terser from "@rollup/plugin-terser"
import {scalajs, production} from "./target/scalajs.rollup.config"
import postcss from "rollup-plugin-postcss"
import cssUrl from "postcss-url"
import url from "@rollup/plugin-url"

const assetOptions = [
    { filter: "**/*.woff2", url: "inline" }
];

const config = {
    input: {
      fonts: "src/main/resources/assets.js"
    },
    plugins: [
        url({limit: 0, fileName: '[dirname][name].[hash][extname]'}),
        postcss({extract: true, minimize: production, plugins: [
            cssUrl(assetOptions)
        ]}),
        production && terser() // minify, but only in production
    ],
    output: scalajs.output,
    context: "window" // silences nonsense rollup build time error message
}

export default Object.assign({}, config)
