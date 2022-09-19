const { getImportPath } = require('../utils/pathUtils')

const exportNamed = ({ nodePath, filePath, basePath, repoPath }) => {
  const node = nodePath.node
  const source = node.source?.module || node.source?.value

  const data = {
    type: nodePath.type,
    specifiers:
      node.specifiers?.map((specifier) => {
        return {
          localName: specifier.local.name,
          exportedName: specifier.exported.name,
        }
      }) || [],
    declaration: node.declaration?.id?.name,
    declarations:
      node.declaration?.declarations?.map((declaration) => {
        return {
          id: declaration?.id?.name,
        }
      }) || [],
    source,
  }

  if (source) {
    data._sourcePath = getImportPath(filePath, source, basePath, repoPath)
  }

  return data
}

module.exports = {
  exportNamed,
}
