import { Graph } from './dfs'
import { ByPath } from './getUsedCode'

export const getUnusedExports = ({
  graph,
  usedCode,
}: {
  graph: Graph
  usedCode: ByPath
}) => {
  const unused: Record<string, string[]> = {}

  Object.entries(graph).forEach(([file, moduleData]) => {
    const names: string[] = moduleData.exports.flatMap((exportData) => {
      const { specifiers, declarations, declaration } = exportData

      return [
        ...(specifiers?.map((spec) => spec.exportedName) || []),
        ...(declarations?.map((dec) => dec.id) || []),
        ...[declaration],
      ]
        .filter((a) => !!a)
        .map((item) => String(item))
    })

    const notFound = names.filter((name) => {
      return !usedCode[file]?.[String(name)]
    })

    if (notFound.length) {
      if (!unused[file]) {
        unused[file] = []
      }

      unused[file] = [...unused[file], ...notFound]
    }
  })

  return unused
}
