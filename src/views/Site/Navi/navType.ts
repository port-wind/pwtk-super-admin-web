export interface Node {
  id: string
  hostDomain: string
  hostPort?: number
  isHttps?: string
  navOutStyle: string
  navPageTemplate?: string
  navDelaySeconds?: number
  navSelectionAlgorithm?: string
  parentId: string
  parentHostDomain?: string
  targetUrl?: string
  status: string
  createTime: number
  hasParent: boolean
  hasChildren: boolean
  children?: Node[]
}
export function createHostDomainMap(data: Node[]): Map<string, Node> {
  const hostDomainMap = new Map<string, Node>()

  function addToMap(node: Node) {
    hostDomainMap.set(node.hostDomain, node)
    if (node.children) {
      node.children.forEach(addToMap)
    }
  }

  data.forEach(addToMap)

  return hostDomainMap
}
export function getNodeParents(
  hostDomainMap: Map<string, Node>,
  clickedHostDomain: string,
  includeSelf: boolean = true
): Node[] {
  const parents: Node[] = []
  let currentNode = hostDomainMap.get(clickedHostDomain)

  while (currentNode && currentNode.parentHostDomain) {
    const parentNode = hostDomainMap.get(currentNode.parentHostDomain)
    if (parentNode) {
      parents.unshift(parentNode) // Add to the beginning of the array
      currentNode = parentNode
    } else {
      break // Break if parent not found in map
    }
  }
  parents.push(hostDomainMap.get(clickedHostDomain)!)
  return parents
}
