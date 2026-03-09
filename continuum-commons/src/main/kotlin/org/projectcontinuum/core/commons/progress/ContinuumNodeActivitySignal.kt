package org.projectcontinuum.core.commons.progress

data class ContinuumNodeActivitySignal(
  val nodeId: String,
  val nodeProgress: NodeProgress
)