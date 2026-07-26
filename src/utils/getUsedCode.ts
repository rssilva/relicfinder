import { Graph } from './dfs'
import { getFullFilePath } from './pathUtils'
import { ModulesData } from '../types/ModulesData'
import _ from 'lodash'
import { ImportSchema } from '../types/ImportSchema'

type VariableNameData = {
  specifiers?: ImportSchema['specifiers']
  _filePath?: string
  type?: string
}

const getInternalImports = (graphData: Graph[string]) =>
  graphData.imports.filter(({ isExternal }) => !isExternal) || []

const getVariablesNames = (internalImports: ImportSchema[]) => {
  return internalImports
    .filter(({ _filePath }) => _filePath)
    .map((importData) =>
      _.pick(importData, ['specifiers', '_filePath', 'type']),
    )
}

const findVariables = (
  names: VariableNameData[],
  graph: Graph,
  extensions: string[],
  modulesData: ModulesData,
) => {
  const result: Record<string, string[]> = {}
  let stack: string[] = [
    ...names.map((name) => name._filePath || '').filter((item) => !!item),
  ]
  const visited = new Set()
  const searchedVars = names
    .flatMap((varData) => {
      return varData.specifiers?.map((specifier) => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          return '__ImportDefaultSpecifier'
        }

        return specifier.name || specifier.localName
      })
    })
    .filter(Boolean)

  while (stack.length != 0) {
    const current = stack.pop()

    if (searchedVars.length && current && !visited.has(current)) {
      visited.add(current)

      const currentVars = getInternalImports(graph[current])
      if (!graph[current]) {
        throw new Error('inexistent graph info')
      }
      const exports = graph[current]?.exports
      // TODO: omg is this a recursive necessity? re-add to the stack?
      // Depending on the type of the export we should go up on the graph (eg ExportNamedDeclaration)
      exports.forEach((exportData) => {
        const { specifiers, declarations, declaration } = exportData

        if (exportData.type === 'ExportDefaultDeclaration') {
          const fullPath = getFullFilePath(
            String(exportData._sourcePath),
            extensions,
            modulesData,
          )

          const index = names.findIndex((varData) => {
            return fullPath == varData._filePath
          })

          if (index > -1) {
            if (!result[current]) {
              result[current] = []
            }

            result[current].push(String(exportData?.name || '__DEFAULT'))
          }
        }

        specifiers?.forEach((specifier) => {
          // to files that exports a variable from another
          if (searchedVars?.includes(specifier?.exportedName || '')) {
            if (exportData._sourcePath) {
              const fullPath = getFullFilePath(
                String(exportData._sourcePath),
                extensions,
                modulesData,
              )

              visited.delete(fullPath)
              stack.push(fullPath)
            }
          }
        })

        declarations?.forEach((declaration) => {
          if (searchedVars?.includes(declaration?.id || '')) {
            if (!result[current]) {
              result[current] = []
            }

            const index = searchedVars.findIndex(
              (name) => name === declaration.id,
            )

            const item = searchedVars.splice(index, 1)

            if (item !== undefined) {
              result[current].push(String(item))
            }
          }
        })

        if (searchedVars?.includes(declaration)) {
          if (!result[current]) {
            result[current] = []
          }

          const index = searchedVars.findIndex((name) => name === declaration)

          const item = searchedVars.splice(index, 1)

          if (item) {
            result[current].push(String(item))
          }
        }
      })

      stack = stack
        .concat(currentVars.map((item) => item._filePath || ''))
        .concat(
          exports.map(
            (item) =>
              getFullFilePath(
                String(item._sourcePath),
                extensions,
                modulesData,
              ) || '',
          ),
        )
    }
  }

  return result
}

type UsedSchema = {
  usedBy: Set<string>
  type: string
}

type ByVariable = Record<string, UsedSchema>

export type ByPath = Record<string, ByVariable>

// TODO: // ImportSpecifier x ImportDefaultSpecifier
// TODO: exportall
// TODO: go up on the graph until the variable is found
export const getUsedCode = ({
  graph,
  extensions,
  modulesData,
}: {
  graph: Graph
  extensions: string[]
  modulesData: ModulesData
}) => {
  const usedCode: ByPath = {}

  Object.entries(graph).forEach(([filePath, graphData]) => {
    const internalImports = getInternalImports(graphData)

    const variableNames = getVariablesNames(internalImports)

    const found = findVariables(variableNames, graph, extensions, modulesData)

    Object.entries(found).forEach(([foundPath, variablesFound]) => {
      variablesFound.forEach((variableName) => {
        if (!usedCode[foundPath]) {
          usedCode[foundPath] = {}
        }

        const hasIt = usedCode[foundPath]?.[variableName]

        if (hasIt) {
          const data = usedCode[foundPath][variableName]

          usedCode[foundPath][variableName] = {
            // ...data,
            usedBy: data.usedBy.add(filePath),
            type: data?.type || 'TBD',
          }
        }

        if (!hasIt) {
          usedCode[foundPath][variableName] = {
            usedBy: new Set([filePath]),
            type: 'TBD',
          }
        }
      })
    })
  })

  return usedCode
}
