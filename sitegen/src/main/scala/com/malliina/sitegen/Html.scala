package com.malliina.sitegen

import com.malliina.live.LiveReload
import scalatags.Text.all.*

class Html(liveReload: Boolean):
  val titleTag = tag("title")

  def generate() = html(
    head(
      meta(charset := "UTF-8"),
      titleTag("Scala.js generated"),
      Seq("frontend.css", "fonts.css").map { file =>
        link(rel := "stylesheet", href := asset(file))
      }
    ),
    body(`class` := "app")(
      p("The time is ", span(id := "time-now")("...")),
      script(`type` := "text/javascript", src := asset("frontend.js")),
      if liveReload then script(`type` := "text/javascript", src := LiveReload.script)
      else modifier()
    )
  )

  def asset(file: String) = s"$file"
