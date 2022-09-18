const _ = require('lodash')
const { getExportAll } = require('./modulesUtils')

const handleExportAll = ({ modulesData, importedItemsByFile, extensions }) => {
  const exportAllList = []

  Object.keys(modulesData).forEach((filePath) => {
    // console.log(file, modulesData[file])
    const fileSource = filePath.replace(/\/index.[^.]{1,}$/, '')
    const currentModule = modulesData[filePath]
    const exportAll = getExportAll(
      currentModule.exports,
      modulesData,
      extensions
    )

    exportAll.forEach((exportPath) => {
      const sourcePath = exportPath.replace(/\/index.[^.]{1,}$/, '')

      const moduleExports = modulesData[filePath].exports
        .filter((e) => e._sourcePath === sourcePath)
        .map((e) => {
          return {
            ...e,
          }
        })

      const currentModuleExports = modulesData[exportPath].exports.map((e) => {
        return {
          ...e,
        }
      })

      if (!importedItemsByFile[exportPath]) {
        importedItemsByFile[exportPath] = {
          usedItems: [],
          usedBy: [],
        }
      }

      if (!importedItemsByFile[filePath]) {
        importedItemsByFile[filePath] = {
          usedItems: [],
          usedBy: [],
        }
      }

      importedItemsByFile[exportPath].usedBy.push(filePath)

      if (moduleExports.length) {
        importedItemsByFile[exportPath].usedItems =
          importedItemsByFile[exportPath].usedItems.concat(moduleExports)
      }

      importedItemsByFile[filePath].usedBy.forEach((usedByPath) => {
        const importsData = modulesData[usedByPath].imports.filter(
          (i) => i.source === fileSource
        )

        const importerSpecifiers = importsData
          .map((i) => [...(i.specifiers || []), ...(i.declarations || [])])
          .flat()

        const currentSpeciersIds = currentModuleExports
          .map((c) => [...(c.specifiers || []), ...(c.declarations || [])])
          .flat()

        const isImportedBy = importerSpecifiers.filter((specifier) => {
          return currentSpeciersIds.find(
            (currentSpecifier) =>
              currentSpecifier.id === specifier.name ||
              currentSpecifier.id === specifier.localName
          )
        })

        console.log(currentSpeciersIds, isImportedBy)

        if (importedItemsByFile[exportPath]?.usedBy) {
          importedItemsByFile[exportPath].usedBy.push(usedByPath)
        }

        if (isImportedBy.length) {
          importedItemsByFile[exportPath].usedItems =
            importedItemsByFile[exportPath].usedItems.concat(isImportedBy)
        }
      })

      exportAllList.push({
        usedBy: filePath,
        exportPath,
        sourcePath,
        moduleExports,
      })
    })
  })

  // console.log(JSON.stringify(importedItemsByFile))
  return { exportAllList, modulesData, importedItemsByFile }
}

module.exports = {
  handleExportAll,
}
