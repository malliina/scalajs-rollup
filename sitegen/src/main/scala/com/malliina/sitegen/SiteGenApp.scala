package com.malliina.sitegen

import buildinfo.BuildInfo

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Paths}

object SiteGenApp:
  val docType = "<!DOCTYPE html>"

  def main(args: Array[String]): Unit =
    val content = Html(liveReload = !BuildInfo.isProd).generate()
    val out = BuildInfo.dist.toPath.resolve("index.html")
    Files.write(out, (docType + content.render).getBytes(StandardCharsets.UTF_8))
