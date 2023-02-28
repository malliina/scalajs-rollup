package com.malliina.sitegen

import buildinfo.BuildInfo
import com.malliina.live.LiveReload
import scalatags.Text.all.*

import java.nio.file.Path
import java.nio.file.Files
import scala.jdk.CollectionConverters.IteratorHasAsScala

class Html(liveReload: Boolean):
  val titleTag = tag("title")

  def generate() = html(lang := "en")(
    head(
      meta(charset := "UTF-8"),
      meta(
        name := "viewport",
        content := "width=device-width, initial-scale=1.0"
      ),
      link(rel := "shortcut icon", `type` := "image/png", href := asset("img/jag-16x16.png")),
      titleTag("Scala.js generated site"),
      Seq("frontend.css", "fonts.css").map { file =>
        link(rel := "stylesheet", href := asset(file))
      }
    ),
    body(`class` := "app")(
      p("The time is now ", span(id := "time-now")("...")),
      script(`type` := "text/javascript", src := asset("frontend.js")),
      if liveReload then script(`type` := "text/javascript", src := LiveReload.script)
      else modifier()
    )
  )
  val dist = BuildInfo.dist.toPath
  val closeable = Files.walk(dist)
  val paths =
    try closeable.iterator().asScala.toList
    finally closeable.close()
  val assets = paths
    .filter(p => Files.isRegularFile(p) && Files.isReadable(p))

  def asset(file: String): String =
    val parts = file.split('.')
    val ext = parts.lastOption
    val name = parts.init.mkString(".")
    assets.filter { a =>
      val str = relative(a)
      str.startsWith(name) && ext.forall(e => str.endsWith(e))
    }.sortBy(p => Files.getLastModifiedTime(p))
      .reverse
      .headOption
      .map(p => relative(p))
      .getOrElse(fileNotFound(file))

  def relative(p: Path) = dist.relativize(p).toString.replace('\\', '/')

  def fileNotFound(file: String) = throw Exception(s"File not found: '$file'.")
