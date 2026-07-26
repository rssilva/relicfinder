import { NodePath } from '@babel/traverse'
import {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isStringLiteral,
} from '@babel/types'

import { isExternal, getImportPath } from '../utils/pathUtils'

type Specifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier

const getName = (specifier: Specifier) => {
  const hasName = !(
    isImportDefaultSpecifier(specifier) || isImportNamespaceSpecifier(specifier)
  )

  const imported = hasName ? specifier.imported : null

  return hasName && !isStringLiteral(imported) ? imported?.name : undefined
}

export const importDeclaration = ({
  nodePath,
  filePath,
  basePath,
  repoPath,
  dependencies = [],
  devDependencies = [],
}: {
  nodePath: NodePath<ImportDeclaration>
  filePath: string
  basePath: string
  repoPath: string
  dependencies: string[]
  devDependencies: string[]
}) => {
  const node = nodePath.node
  const source = node?.source?.value
  const isExternalModule = isExternal(source, dependencies, devDependencies)

  const sourcePath = isExternalModule
    ? source
    : getImportPath(filePath, source, basePath, repoPath)

  return {
    type: nodePath.type,
    specifiers:
      node?.specifiers?.map((specifier) => {
        return {
          name: getName(specifier),
          localName: specifier.local?.name,
          type: specifier.type,
        }
      }) || [],
    source,
    _sourcePath: sourcePath,
    isExternal: isExternalModule,
  }
}
