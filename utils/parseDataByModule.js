const _ = require('lodash')
const { getPossibleModulePaths } = require('./pathUtils')

const isExportAll = (e) => e.type == 'ExportAllDeclaration'

const getModulePath = (modulesData, extensions) => (module) =>
  getPossibleModulePaths(module._sourcePath, extensions).find(
    (path) => modulesData[path]
  )

const hasSamePath = (sourcePath) => (item) => item._sourcePath === sourcePath

const isSpecifierMissing = (moduleImportedData) => (specifier) =>
  !moduleImportedData.usedItems.some((item) => _.isEqual(item, specifier))

const getSpecifiers = (imports = [], sourcePath) =>
  imports.find(hasSamePath(sourcePath)).specifiers || []

const getUniqSpecifiers = (specifiers, moduleImportedData) =>
  _.uniq(
    moduleImportedData.usedItems.concat(
      specifiers.filter(isSpecifierMissing(moduleImportedData))
    )
  )

const getExportAll = (exports, modulesData, extensions) =>
  exports.filter(isExportAll).map(getModulePath(modulesData, extensions)).flat()

const dataTemplate = { usedItems: [], usedBy: [] }

const parseDataByModule = ({ modulesData, extensions }) => {
  let allImports = []
  const importedItemsByFile = {}

  Object.entries(modulesData).forEach(([filePath, currentModule]) => {
    const importedByCurrent = currentModule.imports.filter((i) => !i.isExternal)
    const exportAll = getExportAll(
      currentModule.exports,
      modulesData,
      extensions
    )

    exportAll.length ? (allImports = allImports.concat(exportAll)) : null

    importedByCurrent.forEach((importData) => {
      const moduleFileName = getModulePath(modulesData, extensions)(importData)
      const importSourcePath = importData._sourcePath

      if (!importedItemsByFile[moduleFileName]) {
        importedItemsByFile[moduleFileName] = { ...dataTemplate }
      }

      const moduleImportedData = importedItemsByFile[moduleFileName]

      moduleImportedData.usedBy = moduleImportedData.usedBy.concat(filePath)

      const specifiers = getSpecifiers(currentModule?.imports, importSourcePath)

      if (specifiers.length) {
        // get items that are used by any other module uniquely
        // TODO: maybe does not repeat to count how many times is used?
        moduleImportedData.usedItems = getUniqSpecifiers(
          specifiers,
          moduleImportedData
        )
      }

      moduleFileName ? allImports.push(moduleFileName) : null

      if (!modulesData[moduleFileName]) {
        // console.log('does not have module data associated with', filePath, importData._sourcePath)
      }
    })
  })

  return { allImports, importedItemsByFile }
}

module.exports = {
  parseDataByModule,
}
