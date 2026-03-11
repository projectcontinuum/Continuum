package org.projectcontinuum.core.api.server.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.kotlinModule
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.projectcontinuum.core.api.server.entity.RegisteredNodeEntity
import org.projectcontinuum.core.api.server.model.NodeExplorerItemType
import org.projectcontinuum.core.api.server.repository.RegisteredNodeRepository
import java.time.Instant
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

class NodeExplorerServiceTest {

  private lateinit var repository: RegisteredNodeRepository
  private lateinit var service: NodeExplorerService
  private val objectMapper = ObjectMapper().apply { registerModule(kotlinModule()) }

  @BeforeEach
  fun setUp() {
    repository = mock()
    service = NodeExplorerService(repository)
  }

  // --- Helper to build test entities ---

  private fun createEntity(
    nodeId: String,
    title: String,
    description: String = "A test node",
    categories: List<String> = emptyList(),
    documentation: String = "# Docs"
  ): RegisteredNodeEntity {
    val manifest = objectMapper.writeValueAsString(
      mapOf(
        "title" to title,
        "description" to description,
        "nodeModel" to nodeId,
        "inputs" to emptyMap<String, Any>(),
        "outputs" to emptyMap<String, Any>(),
        "properties" to emptyMap<String, Any>(),
        "propertiesSchema" to emptyMap<String, Any>(),
        "propertiesUISchema" to emptyMap<String, Any>()
      )
    )
    return RegisteredNodeEntity(
      id = null,
      nodeId = nodeId,
      taskQueue = "TASK_QUEUE",
      workerId = "worker-1",
      featureId = "org.test.feature",
      nodeManifest = manifest,
      documentationMarkdown = documentation,
      categories = objectMapper.writeValueAsString(categories),
      registeredAt = Instant.now(),
      lastSeenAt = Instant.now()
    )
  }

  // --- getChildren("") — root level ---

  @Test
  fun `getChildren with empty parentId returns root categories`() {
    whenever(repository.findAllDistinctCategories()).thenReturn(
      listOf("Filter & Select", "Processing", "Transform")
    )
    whenever(repository.findByEmptyCategories()).thenReturn(emptyList())

    val result = service.getChildren("")

    assertEquals(3, result.size)
    assertTrue(result.all { it.type == NodeExplorerItemType.CATEGORY })
    assertTrue(result.all { it.hasChildren })
    assertEquals("Filter & Select", result[0].name)
    assertEquals("Processing", result[1].name)
    assertEquals("Transform", result[2].name)
  }

  @Test
  fun `getChildren with empty parentId includes root-level uncategorized nodes`() {
    whenever(repository.findAllDistinctCategories()).thenReturn(listOf("Processing"))
    val rootNode = createEntity("org.test.RootNode", "Root Node")
    whenever(repository.findByEmptyCategories()).thenReturn(listOf(rootNode))

    val result = service.getChildren("")

    assertEquals(2, result.size)
    assertEquals(NodeExplorerItemType.CATEGORY, result[0].type)
    assertEquals("Processing", result[0].name)
    assertEquals(NodeExplorerItemType.NODE, result[1].type)
    assertEquals("Root Node", result[1].name)
    assertEquals("org.test.RootNode", result[1].id)
  }

  @Test
  fun `getChildren with empty parentId deduplicates root categories from hierarchical paths`() {
    whenever(repository.findAllDistinctCategories()).thenReturn(
      listOf("Processing", "Processing/KNIME", "Processing/Custom")
    )
    whenever(repository.findByEmptyCategories()).thenReturn(emptyList())

    val result = service.getChildren("")

    assertEquals(1, result.size)
    assertEquals("Processing", result[0].name)
    assertEquals("Processing", result[0].id)
    assertTrue(result[0].hasChildren)
  }

  @Test
  fun `getChildren with empty parentId returns empty when no nodes registered`() {
    whenever(repository.findAllDistinctCategories()).thenReturn(emptyList())
    whenever(repository.findByEmptyCategories()).thenReturn(emptyList())

    val result = service.getChildren("")

    assertTrue(result.isEmpty())
  }

  // --- getChildren("Processing") — category level ---

  @Test
  fun `getChildren for category returns nodes with matching category`() {
    whenever(repository.findAllDistinctCategories()).thenReturn(listOf("Processing"))
    val node = createEntity("org.test.JointNode", "Joint Node", categories = listOf("Processing"))
    whenever(repository.findByCategoriesContaining(any())).thenReturn(listOf(node))

    val result = service.getChildren("Processing")

    assertEquals(1, result.size)
    assertEquals(NodeExplorerItemType.NODE, result[0].type)
    assertEquals("Joint Node", result[0].name)
    assertEquals("org.test.JointNode", result[0].id)
    assertEquals(false, result[0].hasChildren)
  }

  @Test
  fun `getChildren for category returns sub-categories and nodes`() {
    whenever(repository.findAllDistinctCategories()).thenReturn(
      listOf("Processing", "Processing/KNIME")
    )
    val node = createEntity("org.test.SplitNode", "Split Node", categories = listOf("Processing"))
    whenever(repository.findByCategoriesContaining(any())).thenReturn(listOf(node))

    val result = service.getChildren("Processing")

    assertEquals(2, result.size)
    // Sub-category first
    assertEquals(NodeExplorerItemType.CATEGORY, result[0].type)
    assertEquals("KNIME", result[0].name)
    assertEquals("Processing/KNIME", result[0].id)
    assertTrue(result[0].hasChildren)
    // Then the node
    assertEquals(NodeExplorerItemType.NODE, result[1].type)
    assertEquals("Split Node", result[1].name)
  }

  @Test
  fun `getChildren for nested category path works correctly`() {
    whenever(repository.findAllDistinctCategories()).thenReturn(
      listOf("Processing/KNIME", "Processing/KNIME/Advanced")
    )
    val node = createEntity("org.test.FilterNode", "Filter Node", categories = listOf("Processing/KNIME"))
    whenever(repository.findByCategoriesContaining(any())).thenReturn(listOf(node))

    val result = service.getChildren("Processing/KNIME")

    assertEquals(2, result.size)
    assertEquals(NodeExplorerItemType.CATEGORY, result[0].type)
    assertEquals("Advanced", result[0].name)
    assertEquals("Processing/KNIME/Advanced", result[0].id)
    assertEquals(NodeExplorerItemType.NODE, result[1].type)
    assertEquals("Filter Node", result[1].name)
  }

  @Test
  fun `getChildren for category with no nodes returns empty`() {
    whenever(repository.findAllDistinctCategories()).thenReturn(listOf("Transform"))
    whenever(repository.findByCategoriesContaining(any())).thenReturn(emptyList())

    val result = service.getChildren("NonExistent")

    assertTrue(result.isEmpty())
  }

  // --- search ---

  @Test
  fun `search returns matching nodes`() {
    val node = createEntity("org.test.CreateTableNode", "Create Table", description = "Creates a table")
    whenever(repository.searchNodes("%table%")).thenReturn(listOf(node))

    val result = service.search("table")

    assertEquals(1, result.size)
    assertEquals(NodeExplorerItemType.NODE, result[0].type)
    assertEquals("Create Table", result[0].name)
    assertEquals("org.test.CreateTableNode", result[0].id)
  }

  @Test
  fun `search with blank query returns empty`() {
    val result = service.search("")
    assertTrue(result.isEmpty())
  }

  @Test
  fun `search with whitespace-only query returns empty`() {
    val result = service.search("   ")
    assertTrue(result.isEmpty())
  }

  @Test
  fun `search passes correct ILIKE pattern to repository`() {
    whenever(repository.searchNodes(any())).thenReturn(emptyList())

    service.search("filter")

    verify(repository).searchNodes("%filter%")
  }

  // --- getDocumentation ---

  @Test
  fun `getDocumentation returns markdown for existing node`() {
    whenever(repository.findDocumentationByNodeId("org.test.Node")).thenReturn("# Node Docs\nSome content")

    val result = service.getDocumentation("org.test.Node")

    assertEquals("# Node Docs\nSome content", result)
  }

  @Test
  fun `getDocumentation returns null for non-existing node`() {
    whenever(repository.findDocumentationByNodeId("org.test.NonExistent")).thenReturn(null)

    val result = service.getDocumentation("org.test.NonExistent")

    assertNull(result)
  }
}
