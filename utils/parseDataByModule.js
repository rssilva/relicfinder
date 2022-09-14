const _ = require('lodash')
const { getPossibleModulePaths } = require('./pathUtils')

const isExportAll = (e) => e.type == 'ExportAllDeclaration'
const dataTemplate = { usedItems: [], usedBy: [] }

const parseDataByModule = ({ modulesData, extensions }) => {
  let allImports = []
  const importedItemsByFile = {}

  Object.entries(modulesData).forEach(([filePath, currentModule]) => {
    const getModulePath = (module) =>
      getPossibleModulePaths(module._sourcePath, extensions).find(
        (path) => modulesData[path]
      )

    const importedByCurrent = currentModule.imports.filter((i) => !i.isExternal)
    const exportAll = currentModule.exports
      .filter(isExportAll)
      .map(getModulePath)
      .flat()

    if (exportAll.length) {
      allImports = allImports.concat(exportAll)
    }

    importedByCurrent.forEach((importData) => {
      const moduleFileName = getModulePath(importData)

      if (!importedItemsByFile[moduleFileName]) {
        importedItemsByFile[moduleFileName] = { ...dataTemplate }
      }

      const moduleImportedData = importedItemsByFile[moduleFileName]

      moduleImportedData.usedBy = moduleImportedData.usedBy.concat(filePath)

      const hasSamePath = (item) => item._sourcePath === importData._sourcePath

      const specifiers =
        currentModule?.imports.find(hasSamePath).specifiers || []

      if (specifiers.length) {
        const isSpecifierMissing = (specifier) =>
          !moduleImportedData.usedItems.some((item) =>
            _.isEqual(item, specifier)
          )

        // get items that are used by any other module uniquely
        // TODO: maybe does not repeat to count how many times is used?
        moduleImportedData.usedItems = _.uniq(
          moduleImportedData.usedItems.concat(
            specifiers.filter(isSpecifierMissing)
          )
        )
      }

      if (moduleFileName) {
        allImports.push(moduleFileName)
      }

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
