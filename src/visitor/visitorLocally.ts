import { ParseResult } from '@babel/parser'
import traverse, { Node, NodePath, Scope } from '@babel/traverse'
// import { Declaration, identifier, VariableDeclarator } from '@babel/types'
// import fs from 'fs'
import _ from 'lodash'
// import { printf } from '../utils/logger'

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
    VariableDeclaration(nodePath) {
      const declarations = nodePath.node.declarations
      // @ts-expect-error id.name
      const found = declarations.find((dec) => dec.id.name === name)

      if (found) {
        invokes.push(nodePath?.parentPath)
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

  const exps = getExports({ ast })

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

        const foundExport = exps.find(([names]) => {
          return !!names?.filter((name) => name === String(generic)).length
        })

        const shouldLook = !(
          nodePath.isExportNamedDeclaration() ||
          nodePath.isVariableDeclarator() ||
          nodePath.isIdentifier()
        )

        if (foundExport && shouldLook) {
          const res = getDefinitionParent({
            searchNode: nodePath,
            name: String(generic),
            invokes: [],
          })

          const defined = !!res.find((resNode) => {
            const scope = resNode.scope

            if (resNode.isExportNamedDeclaration()) {
              return false
            }

            if (foundExport[2].key === resNode.key) {
              return false
            }

            // printf(generic, scope.uid, found?.[2].scope.uid, nodePath.scope.uid)
            return scope.uid !== foundExport?.[2].scope.uid
          })

          if (!defined) {
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
          nodePath.isVariableDeclarator() ||
          nodePath.isProgram()
        ) || nodePath.isJSXOpeningElement()

      if (shouldAdd) {
        // printf('will add', isMatch)

        nodePaths.push({
          ...nodePath.node,
          // @ts-expect-error wrong type
          scopeUID: nodePath.scope.uid,
          isMatch,
        })
      }
    },
    // ExportNamedDeclaration(nodePath) {
    //   if (!nodePath.isClassDeclaration()) {
    //     // @ts-ignore
    //     console.log(nodePath.node.declaration?.declarations?.length)
    //     exps.push([
    //       // @ts-ignore
    //       nodePath.node.declaration?.declarations
    //         // @ts-ignore
    //         ?.map((i) => i.id?.name)
    //         .flat() || [],
    //       nodePath.scope,
    //       nodePath,
    //       nodePath.node.loc,
    //     ])
    //   }
    // },
  })

  // fs.writeFileSync('./reports/scopes.json', JSON.stringify(nodePaths, null, 2))

  return nodePaths
}
