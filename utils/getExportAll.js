// const { exportAll } = require('../visitor/exportAll')
const { getExportAll, getNamedExport } = require('./modulesUtils')

const handleExportAll = ({ modulesData, importedItemsByFile, extensions }) => {
  const exportAllList = []

  Object.keys(modulesData).forEach((importerFilePath) => {
    console.log(importerFilePath)
    const importerSource = importerFilePath.replace(/\/index.[^.]{1,}$/, '')
    const importerModule = modulesData[importerFilePath]
    const exportAll = getExportAll(
      importerModule.exports,
      modulesData,
      extensions
    )
    const namedExports = getNamedExport(
      importerModule.exports,
      modulesData,
      extensions
    )

    const list = [...exportAll, ...namedExports]

    list.forEach((exportPath) => {
      const sourcePath = exportPath.replace(/\/index.[^.]{1,}$/, '')

      const importerExportsFiltered = modulesData[importerFilePath].exports
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

      if (!importedItemsByFile[importerFilePath]) {
        importedItemsByFile[importerFilePath] = {
          usedItems: [],
          usedBy: [],
        }
      }

      importedItemsByFile[exportPath].usedBy.push(importerFilePath)

      if (importerExportsFiltered.length) {
        importedItemsByFile[exportPath].usedItems = importedItemsByFile[
          exportPath
        ].usedItems.concat(importerExportsFiltered)
      }

      importedItemsByFile[importerFilePath].usedBy.forEach((usedByPath) => {
        const importsData = modulesData[usedByPath].imports.filter(
          (i) => i._sourcePath === importerSource
        )

        const importerSpecifiers = importsData
          .map((i) => [...(i.specifiers || []), ...(i.declarations || [])])
          .flat()

        const currentSpeciersIds = currentModuleExports
          .map((c) => [...(c.specifiers || []), ...(c.declarations || [])])
          .flat()

        const isImportedBy = importerSpecifiers.filter((specifier) => {
          return currentSpeciersIds.find((currentSpecifier) => {
            return (
              currentSpecifier.id === specifier.name ||
              currentSpecifier.id === specifier.localName ||
              currentSpecifier.exportedName === specifier.name ||
              currentSpecifier.localName === specifier.exportedName
            )
          })
        })

        if (importedItemsByFile[exportPath]?.usedBy) {
          importedItemsByFile[exportPath].usedBy.push(usedByPath)
        }

        if (isImportedBy.length) {
          importedItemsByFile[exportPath].usedItems =
            importedItemsByFile[exportPath].usedItems.concat(isImportedBy)
        }
      })

      exportAllList.push({
        usedBy: importerFilePath,
        exportPath,
        sourcePath,
        importerExportsFiltered,
      })
    })
  })

  return { exportAllList, modulesData, importedItemsByFile }
}

module.exports = {
  handleExportAll,
}
