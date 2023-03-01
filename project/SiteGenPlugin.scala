import BuildKeys.build
import RollupPlugin.autoImport.outputDir
import SiteGenPlugin.autoImport.frontendProject
import com.malliina.live.LiveReloadPlugin
import com.malliina.live.LiveReloadPlugin.autoImport.{liveReloadRoot, refreshBrowsers, reloader}
import org.scalajs.sbtplugin.ScalaJSPlugin.autoImport.{FullOptStage, scalaJSStage}
import sbt.Keys.run
import sbt.{AutoPlugin, Compile, Def, Global, Plugins, Project, Setting, settingKey}
import sbtbuildinfo.BuildInfoPlugin
import sbtbuildinfo.BuildInfoPlugin.autoImport.buildInfoKeys

object SiteGenPlugin extends AutoPlugin {
  override def requires: Plugins = LiveReloadPlugin && BuildInfoPlugin

  object autoImport {
    val frontendProject = settingKey[Project]("Scala.js project")
  }

  override def projectSettings: Seq[Setting[?]] = Seq(
    build := (Compile / run).toTask(" ").value,
    build := build.dependsOn {
      Def.task {
        reloader.value.start()
      }
    }.value,
    build := build.dependsOn(Def.taskDyn(frontendProject.value / Compile / build)).value,
    refreshBrowsers := refreshBrowsers.triggeredBy(build).value,
    liveReloadRoot := Def.settingDyn {
      frontendProject.value / Compile / outputDir
    }.value.toPath,
    buildInfoKeys ++= Seq(
      "dist" -> liveReloadRoot.value.toFile,
      "isProd" -> ((Global / scalaJSStage).value == FullOptStage)
    )
  )
}
