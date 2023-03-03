package com.malliina.sitegen

import buildinfo.BuildInfo
import scalatags.Text.all.s

import java.nio.file.{Files, NoSuchFileException, Path}
import scala.jdk.CollectionConverters.IteratorHasAsScala

class Assets:
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

  def fileNotFound(file: String) = throw NoSuchFileException(s"File not found: '$file'.")
