import { ParseResult } from '@babel/parser'
import traverse, { Node, NodePath } from '@babel/traverse'

export const traverseEnter = ({
  ast,
  filePath,
}: {
  ast: ParseResult | undefined
  filePath: string
}) => {
  const nodePaths: Node[] = []

  if (!filePath) {
    throw new Error('missing filepath')
  }

  if (!ast) {
    throw new Error(`missing ast to ${filePath}`)
  }

  traverse(ast, {
    enter(nodePath) {
      const shouldAdd =
        !(
          nodePath.isExportNamedDeclaration() ||
          nodePath.isExportSpecifier() ||
          nodePath.isVariableDeclaration() ||
          nodePath.isVariableDeclarator() ||
          nodePath.isProgram()
        ) || nodePath.isJSXOpeningElement()

      if (shouldAdd) {
        nodePaths.push(nodePath.node)
      }
    },
    ExportNamedDeclaration() {},
    ExportSpecifier() {},
  })

  return nodePaths
}
