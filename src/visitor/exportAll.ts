import { NodePath } from '@babel/traverse'
import { ExportAllDeclaration } from '@babel/types'
import { getImportPath } from '../utils/pathUtils'

export const exportAll = ({
  nodePath,
  filePath,
  basePath,
  repoPath,
}: {
  nodePath: NodePath<ExportAllDeclaration>
  filePath: string
  basePath: string
  repoPath: string
}) => {
  const node = nodePath.node
  const source = node.source?.value

  return {
    type: nodePath.type,
    value: source,
    _sourcePath: getImportPath(filePath, source, basePath, repoPath),
  }
}
