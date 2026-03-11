package org.projectcontinuum.core.api.server.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.kotlinModule
import com.fasterxml.jackson.module.kotlin.readValue
import org.projectcontinuum.core.api.server.entity.RegisteredNodeEntity
import org.projectcontinuum.core.api.server.model.NodeExplorerItemType
import org.projectcontinuum.core.api.server.model.NodeExplorerTreeItem
import org.projectcontinuum.core.api.server.repository.RegisteredNodeRepository
import org.projectcontinuum.core.commons.model.ContinuumWorkflowModel
import org.springframework.stereotype.Service

@Service
class NodeExplorerService(
  private val registeredNodeRepository: RegisteredNodeRepository
) {

  private val objectMapper = ObjectMapper().apply {
    registerModule(kotlinModule())
  }

  fun getChildren(parentId: String): List<NodeExplorerTreeItem> {
    if (parentId.isBlank()) {
      return getRootItems()
    }
    return getItemsForCategory(parentId)
  }

  fun search(query: String): List<NodeExplorerTreeItem> {
    if (query.isBlank()) return emptyList()
    val pattern = "%${query}%"
    return registeredNodeRepository.searchNodes(pattern)
      .map { it.toNodeTreeItem() }
  }

  fun getDocumentation(nodeId: String): String? {
    return registeredNodeRepository.findDocumentationByNodeId(nodeId)
  }

  private fun getRootItems(): List<NodeExplorerTreeItem> {
    val allCategories = registeredNodeRepository.findAllDistinctCategories()

    // Extract root-level categories (the part before the first "/")
    val rootCategories = allCategories
      .map { it.split("/").first() }
      .distinct()
      .sorted()
      .map { category ->
        NodeExplorerTreeItem(
          id = category,
          name = category,
          hasChildren = true,
          type = NodeExplorerItemType.CATEGORY
        )
      }

    // Nodes with empty categories appear at root level
    val rootNodes = registeredNodeRepository.findByEmptyCategories()
      .map { it.toNodeTreeItem() }

    return rootCategories + rootNodes
  }

  private fun getItemsForCategory(categoryPath: String): List<NodeExplorerTreeItem> {
    val allCategories = registeredNodeRepository.findAllDistinctCategories()

    // Find sub-categories under this path
    val subCategories = allCategories
      .filter { it.startsWith("$categoryPath/") }
      .map { it.removePrefix("$categoryPath/").split("/").first() }
      .distinct()
      .sorted()
      .map { subCat ->
        NodeExplorerTreeItem(
          id = "$categoryPath/$subCat",
          name = subCat,
          hasChildren = true,
          type = NodeExplorerItemType.CATEGORY
        )
      }

    // Find nodes that have this exact category
    val categoryJsonArray = objectMapper.writeValueAsString(listOf(categoryPath))
    val nodes = registeredNodeRepository.findByCategoriesContaining(categoryJsonArray)
      .map { it.toNodeTreeItem() }

    return subCategories + nodes
  }

  private fun RegisteredNodeEntity.toNodeTreeItem(): NodeExplorerTreeItem {
    val nodeData: ContinuumWorkflowModel.NodeData = objectMapper.readValue(nodeManifest)
    return NodeExplorerTreeItem(
      id = nodeId,
      name = nodeData.title,
      nodeInfo = nodeData,
      hasChildren = false,
      type = NodeExplorerItemType.NODE
    )
  }
}
