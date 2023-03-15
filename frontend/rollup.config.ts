import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import url from "@rollup/plugin-url"
import {scalajs, production, outputDir} from "./target/scalajs.rollup.config.js"
import path from "path"
import extractcss from "./rollup-extract-css"
import type {RollupOptions} from "rollup"
import sourcemaps from "./rollup-sourcemaps";
import * as http from "http";

const resourcesDir = "src/main/resources"
const urlOptions = [
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
    assetsPath: "assets", // this must be defined but can be whatever since it "cancels out" the "../" in the source files
    useHash: production,
    hashOptions: {append: true}
  }
]

const entryNames = production ? "[name].[hash].js" : "[name].js"

const css = () => extractcss({
  outDir: outputDir,
  minimize: production,
  urlOptions: urlOptions
})

// With a path of "../src/https:/www.google.com", prefix of "https:/" and replacement of "https://",
// returns "https://www.google.com"
const sourcemapFix = (path: string, prefix: string, replacement: string): string => {
  const idx = path.indexOf(prefix)
  if (idx > 0) {
    const address = path.substring(idx + prefix.length)
    return `${replacement}${address}`
  }
  return path
}

const config: RollupOptions[] = [
  {
    input: scalajs.input,
    plugins: [
      sourcemaps({}),
      css(),
      resolve(), // tells Rollup how to find date-fns in node_modules
      commonjs(), // converts date-fns to ES modules
      production && terser() // minify, but only in production
    ],
    output: {
      dir: outputDir,
      format: "iife",
      name: "version",
      entryFileNames: entryNames,
      sourcemap: true,
      sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
        // relativeSourcePath is unreliable; this replaces bogus paths with absolute paths
        const httpsFixed = sourcemapFix(relativeSourcePath, "https:/", "https://")
        return sourcemapFix(httpsFixed, "file:/", "file:///")
      }
    }
  },
  {
    input: {
      fonts: path.resolve(resourcesDir, "fonts.js"),
      styles: path.resolve(resourcesDir, "styles.js")
    },
    plugins: [
      url({
        limit: 0,
        fileName: production ? "[dirname][name].[hash][extname]" : "[dirname][name][extname]"
      }),
      css(),
      production && terser()
    ],
    output: {
      dir: outputDir,
      entryFileNames: entryNames
    }
  }
]

export default config
