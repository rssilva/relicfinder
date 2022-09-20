const { getPossibleModulePaths } = require('./pathUtils')

const isExportAll = (exportData) => exportData.type == 'ExportAllDeclaration'
const isNamedExportFromSource = (exportData) =>
  exportData.type == 'ExportNamedDeclaration' && !!exportData._sourcePath

const getExportAll = (exports, modulesData, extensions) =>
  exports.filter(isExportAll).map(getModulePath(modulesData, extensions)).flat()

const getNamedExport = (exports, modulesData, extensions) =>
  exports
    .filter(isNamedExportFromSource)
    .map(getModulePath(modulesData, extensions))
    .flat()

const getModulePath = (modulesData, extensions) => (module) =>
  getPossibleModulePaths(module._sourcePath, extensions).find(
    (path) => modulesData[path]
  )

module.exports = {
  isExportAll,
  getExportAll,
  getModulePath,
  getNamedExport,
}
