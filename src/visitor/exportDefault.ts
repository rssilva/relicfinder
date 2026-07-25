import { NodePath } from '@babel/traverse'
import { ExportDefaultDeclaration } from '@babel/types'

type Declaration = ExportDefaultDeclaration['declaration']
type WithName = Declaration & { name: string }

function hasName(declaration: Declaration): declaration is WithName {
  return 'name' in declaration
}

export const exportDefault = (
  nodePath: NodePath<ExportDefaultDeclaration>,
  filePath: string,
) => {
  return {
    type: nodePath.type,
    name: hasName(nodePath.node.declaration)
      ? nodePath.node.declaration.name
      : undefined,
    specifiers: [],
    declarationType: nodePath?.node?.declaration?.type,
    _sourcePath: filePath,
  }
}
