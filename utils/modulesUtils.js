const { getPossibleModulePaths } = require('./pathUtils')

const isExportAll = (e) => e.type == 'ExportAllDeclaration'

const getExportAll = (exports, modulesData, extensions) =>
  exports.filter(isExportAll).map(getModulePath(modulesData, extensions)).flat()

const getModulePath = (modulesData, extensions) => (module) =>
  getPossibleModulePaths(module._sourcePath, extensions).find(
    (path) => modulesData[path]
  )

module.exports = {
  isExportAll,
  getExportAll,
  getModulePath,
}
