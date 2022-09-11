const { isExternal, getImportPath } = require('../utils/pathUtils')

const importDeclaration = ({
  nodePath,
  filePath,
  basePath,
  repoPath,
  dependencies = [],
  devDependencies = [],
}) => {
  // console.log(Object.keys(nodePath))
  const node = nodePath.node
  const source = node?.source?.value
  const isExternalModule = isExternal(source, dependencies, devDependencies)

  return {
    type: nodePath.type,
    specifiers: node?.specifiers?.map((specifier) => {
      return {
        name: specifier.imported?.name,
        localName: specifier.local?.name,
        type: specifier.type,
      }
    }),
    source,
    _sourcePath: isExternalModule
      ? source
      : getImportPath(filePath, source, basePath, repoPath),
    isExternal: isExternalModule,
  }
}

module.exports = {
  importDeclaration,
}
