import sbt.Keys.{baseDirectory, streams}
import sbt.{AutoPlugin, Plugins, Setting, ThisBuild, taskKey}
import BuildKeys.{isProd, build}

object NetlifyPlugin extends AutoPlugin {
  override def requires: Plugins = SiteGenPlugin

  object autoImport {
    val deploy = taskKey[Unit]("Deploys the site")
  }
  import autoImport._

  override def projectSettings: Seq[Setting[?]] = Seq(
    deploy := {
      val params = if (isProd.value) Seq("--prod") else Nil
      RollupPlugin.process(
        Seq("netlify", "deploy") ++ params,
        (ThisBuild / baseDirectory).value,
        streams.value.log
      )
    },
    deploy := deploy.dependsOn(build).value
  )
}
