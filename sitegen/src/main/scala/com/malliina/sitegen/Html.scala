package com.malliina.sitegen

import buildinfo.BuildInfo
import com.malliina.live.LiveReload
import scalatags.Text.all.*

import java.nio.file.{Files, NoSuchFileException, Path}
import scala.jdk.CollectionConverters.IteratorHasAsScala

class Html(liveReload: Boolean):
  val titleTag = tag("title")
  val assets = Assets()
  def asset(file: String) = assets.asset(file)

  def generate() = html(lang := "en")(
    head(
      meta(charset := "UTF-8"),
      meta(
        name := "viewport",
        content := "width=device-width, initial-scale=1.0"
      ),
      link(rel := "shortcut icon", `type` := "image/png", href := asset("img/jag-16x16.png")),
      titleTag("Scala.js generated site"),
      Seq("styles.css", "fonts.css").map { file =>
        link(rel := "stylesheet", href := asset(file))
      }
    ),
    body(`class` := "app")(
      p("The time is ", span(id := "time-now")("...")),
      div(`class` := "box"),
      script(`type` := "text/javascript", src := asset("frontend.js")),
      if liveReload then script(`type` := "text/javascript", src := LiveReload.script)
      else modifier()
    )
  )
