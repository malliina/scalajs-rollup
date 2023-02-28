scalaVersion := "2.12.17"

Seq(
  "org.scala-js" % "sbt-scalajs" % "1.13.0",
  "com.malliina" % "live-reload" % "0.5.0",
  "com.eed3si9n" % "sbt-buildinfo" % "0.11.0"
) map addSbtPlugin
