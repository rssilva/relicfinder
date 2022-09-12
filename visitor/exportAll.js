const { getImportPath } = require('../utils/pathUtils')

const exportAll = ({ nodePath, filePath, basePath, repoPath }) => {
  const node = nodePath.node
  const source = node.source?.module || node.source?.value

  return {
    type: nodePath.type,
    value: node.source?.module || node.source?.value,
    _sourcePath: getImportPath(filePath, source, basePath, repoPath),
  }
}

module.exports = {
  exportAll,
}
