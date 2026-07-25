import { NodePath } from '@babel/traverse'
import {
  ExportDefaultSpecifier,
  ExportNamedDeclaration,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  isExportSpecifier,
  Identifier,
  VariableDeclarator,
  LVal,
  VoidPattern,
} from '@babel/types'

import { getImportPath } from '../utils/pathUtils'

type Specifier =
  | ExportDefaultSpecifier
  | ExportNamespaceSpecifier
  | ExportSpecifier

type Exported = Specifier['exported']
type Declaration = NodePath<ExportNamedDeclaration>['node']['declaration']
type WithId = Declaration & { id: { name: string } }
type WithDeclarations = Declaration & { declarations: VariableDeclarator[] }
type WithName = LVal & { name: string }

function isIdentifier(specifier: Exported): specifier is Identifier {
  return typeof (<Exported>specifier) !== 'string'
}

function hasId(declaration: Declaration): declaration is WithId {
  if (!declaration) {
    return false
  }

  return 'id' in declaration
}

function hasDeclarations(
  declaration: Declaration,
): declaration is WithDeclarations {
  if (!declaration) {
    return false
  }

  return 'declarations' in declaration
}

function hasName(id: LVal | VoidPattern): id is WithName {
  if (!id) {
    return false
  }

  return 'name' in id
}

const getLocalName = (specifier: Specifier) => {
  return isExportSpecifier(specifier) ? specifier.local.name : undefined
}

type ExportedData = {
  type: ExportNamedDeclaration['type']
  specifiers: { localName?: string; exportedName: string }[]
  declaration: string | undefined
  declarations: { id: string }[]
  source: string | undefined
  _sourcePath: undefined | string
}

export const exportNamed = ({
  nodePath,
  filePath,
  basePath,
  repoPath,
}: {
  nodePath: NodePath<ExportNamedDeclaration>
  filePath: string
  basePath: string
  repoPath: string
}): ExportedData => {
  const node = nodePath.node

  const source = node.source?.value

  const data: ExportedData = {
    type: nodePath.type,
    specifiers:
      node.specifiers?.map((specifier) => {
        return {
          localName: getLocalName(specifier),
          exportedName: isIdentifier(specifier?.exported)
            ? specifier.exported.name
            : '',
        }
      }) || [],

    declaration: hasId(node.declaration)
      ? node.declaration?.id?.name
      : undefined,
    declarations: hasDeclarations(node.declaration)
      ? node.declaration?.declarations?.map((declaration) => {
          return {
            id: hasName(declaration.id) ? declaration?.id?.name : '',
          }
        })
      : [],
    source,
    _sourcePath: undefined,
  }

  if (source) {
    data._sourcePath = getImportPath(filePath, source, basePath, repoPath)
  }

  return data
}
