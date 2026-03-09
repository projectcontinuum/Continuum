package org.projectcontinuum.core.commons.progress

interface NodeProgressCallback {
  fun report(
    nodeProgress: NodeProgress
  )
  fun report(
    progressPercentage: Int
  )
}