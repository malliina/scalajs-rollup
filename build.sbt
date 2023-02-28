val build = taskKey[Unit]("Builds the app")

val scalatagsVersion = "0.12.0"
val munitVersion = "0.7.29"

inThisBuild(
  Seq(
    version := "0.0.1",
    scalaVersion := "3.2.2",
    libraryDependencies ++= Seq(
      "com.lihaoyi" %%% "scalatags" % scalatagsVersion,
      "org.scalameta" %%% "munit" % munitVersion % Test
    ),
    testFrameworks += new TestFramework("munit.Framework")
  )
)

val frontend = project
  .in(file("frontend"))
  .enablePlugins(ScalaJSPlugin, RollupPlugin)
  .settings(
    libraryDependencies ++= Seq(
      "org.scala-js" %%% "scalajs-dom" % "2.4.0"
    ),
    scalaJSUseMainModuleInitializer := true
  )

val sitegen = project
  .in(file("sitegen"))
  .enablePlugins(SiteGenPlugin)
  .settings(
    frontendProject := frontend
  )

val app = project.in(file(".")).aggregate(frontend, sitegen)
