import { ModuleData, ModulesData } from '../types/ModulesData'
import { getFullFilePath } from './pathUtils'

export type Graph = Record<string, ModuleData & { filePath: string }>

// depth-first search, whey an acronym here? I was asking the same
export const dfs = (
  entryPoints: string[],
  modulesData: ModulesData,
  extensions: string[],
) => {
  const stack = [...entryPoints]
  const visited = new Set()
  const graph: Graph = {}
  const usedBy: Record<string, string[]> = {}

  while (stack.length != 0) {
    const current = stack.pop()

    if (current && !visited.has(current)) {
      visited.add(current)

      graph[current] = {
        exports: modulesData[current]?.exports || [],
        imports: modulesData[current]?.imports || [],
        filePath: getFullFilePath(current || '', extensions, modulesData),
      }

      graph[current].imports = graph[current].imports.map((importData) => {
        return {
          ...importData,
          _filePath: getFullFilePath(
            importData._sourcePath || '',
            extensions,
            modulesData,
          ),
        }
      })

      const paths = [
        ...(modulesData[current]?.imports || []),
        ...(modulesData[current]?.exports || []),
      ].map((item) => item._sourcePath)

      paths.forEach((filePath) => {
        if (filePath) {
          const importPath = getFullFilePath(filePath, extensions, modulesData)

          if (importPath) {
            stack.push(importPath)

            if (!usedBy[importPath]) {
              usedBy[importPath] = []
            }

            usedBy[importPath].push(current)
          }
        }
      })
    }
  }

  return { graph, usedBy }
}
