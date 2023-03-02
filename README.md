# scalajs-rollup

Install [rollup.js](https://www.rollupjs.org/).

    sbt ~build

Navigate to http://localhost:10101.

To make a prod build:

    sbt "set scalaJSStage in Global := FullOptStage" build
