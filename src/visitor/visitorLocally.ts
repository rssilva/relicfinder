import { ParseResult } from '@babel/parser'
import traverse, { Node, NodePath, Scope } from '@babel/traverse'
import _ from 'lodash'
import { VariableDeclaratorGuard } from '../utils/types/typeGuards'

const getDefinitionParent = ({
  searchNode,
  name,
  invokes = [],
}: {
  searchNode: NodePath['parentPath']
  name: string
  invokes: NodePath[]
}) => {
  searchNode?.traverse({
    VariableDeclarator(nodePath) {
      const found = VariableDeclaratorGuard.hasName(nodePath.node)
        ? name === nodePath.node.id.name
        : false

      if (found) {
        invokes.push(nodePath)
      }
    },
  })

  if (searchNode?.parentPath) {
    getDefinitionParent({ searchNode: searchNode.parentPath, name, invokes })
  }

  return invokes
}

const getExports = ({ ast }: { ast: ParseResult | undefined }) => {
  const exps: [string[], Scope, NodePath, Node['loc']][] = []

  if (!ast) {
    return exps
  }

  traverse(ast, {
    ExportNamedDeclaration(nodePath) {
      if (!nodePath.isClassDeclaration()) {
        exps.push([
          // @ts-expect-error declarations
          nodePath.node.declaration?.declarations
            // @ts-expect-error name
            ?.map((i) => i.id?.name)
            .flat() || [],
          nodePath.scope,
          nodePath,
          nodePath.node.loc,
        ])
      }
    },
  })

  return exps
}

export const traverseEnter = ({
  ast,
  filePath,
  searchedVars,
}: {
  ast: ParseResult | undefined
  filePath: string
  searchedVars: string[]
}) => {
  const nodePaths: Node[] = []

  if (!filePath) {
    throw new Error('missing filepath')
  }

  if (!ast) {
    throw new Error(`missing ast to ${filePath}`)
  }

  const exports = getExports({ ast })

  traverse(ast, {
    enter(nodePath) {
      let isMatch = false

      const id = _.get(nodePath.node, 'id.name')
      const callee = _.get(nodePath.node, 'expression.callee.name')
      const name = _.get(nodePath.node, 'name')

      if (
        searchedVars.includes(String(name)) ||
        searchedVars.includes(String(id)) ||
        searchedVars.includes(String(callee))
      ) {
        const generic = id || name || callee

        const foundExport = exports.find(([names]) => {
          return !!names?.filter((name) => name === String(generic)).length
        })

        const shouldIgnore =
          nodePath.isExportNamedDeclaration() ||
          nodePath.isVariableDeclarator() ||
          nodePath.isVariableDeclaration()

        if (foundExport && !shouldIgnore) {
          const definitions = getDefinitionParent({
            searchNode: nodePath,
            name: String(generic),
            invokes: [],
          })

          const hasVariableOnParent = definitions.find((definition) => {
            if (nodePath.isIdentifier()) {
              if (nodePath.parentPath.isVariableDeclarator()) {
                return nodePath.node
              }

              if (
                nodePath.node.loc?.start.line ===
                foundExport?.[2].node.loc?.start.line
              ) {
                return nodePath.node
              }
            }

            if (nodePath.node === definition.node) {
              return nodePath
            }

            const hasVarDeclarator = nodePath.find((closePath) => {
              const siblings = [
                ...closePath.getAllNextSiblings(),
                ...closePath.getAllPrevSiblings(),
              ]

              const hasSiblings = siblings.some((sibling) => {
                let hasFoundName = false

                if (sibling.isVariableDeclaration()) {
                  sibling.node.declarations.forEach((declaration) => {
                    const name = VariableDeclaratorGuard.hasName(declaration)
                      ? declaration.id.name
                      : ''

                    if (name === generic) {
                      hasFoundName = true
                    }
                  })
                }

                return hasFoundName
              })

              return hasSiblings
            })

            if (hasVarDeclarator) {
              return nodePath
            }

            return nodePath.node === foundExport?.[2].node
              ? nodePath.node
              : false
          })

          if (!hasVariableOnParent) {
            isMatch = true
          }
        }
      }
      const shouldAdd =
        !(
          nodePath.isExportNamedDeclaration() ||
          // nodePath.isExportSpecifier() ||
          // nodePath.isIdentifier() ||
          // nodePath.isExpressionStatement() ||
          nodePath.isVariableDeclaration() ||
          nodePath.isVariableDeclarator() ||
          nodePath.isProgram()
        ) || nodePath.isJSXOpeningElement()

      if (shouldAdd) {
        nodePaths.push({
          ...nodePath.node,
          // @ts-expect-error wrong type
          scopeUID: nodePath.scope.uid,
          isMatch,
        })
      }
    },
  })

  return nodePaths
}
