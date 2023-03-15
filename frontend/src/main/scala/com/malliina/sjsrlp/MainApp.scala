package com.malliina.sjsrlp

import scala.scalajs.js
import scala.scalajs.js.Date
import scala.scalajs.js.annotation.JSImport
import org.scalajs.dom

object MainApp:
  def main(args: Array[String]): Unit =
    val formatted = dateFns.format(new Date(), "h:mm:ss")
    dom.document.getElementById("time-now").textContent = formatted
    println(s"Hello, world! The time is now $formatted")
    throw Exception("Hey")

@js.native
@JSImport("date-fns", JSImport.Default)
object dateFns extends js.Object:
  def format(date: Date, fmt: String): String = js.native
