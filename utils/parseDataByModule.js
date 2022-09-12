const _ = require('lodash')
const { getPossibleModulePaths } = require('./pathUtils')

const parseDataByModule = ({ modulesData, extensions }) => {
  let allImports = []
  const importedItemsByFile = {}

  Object.entries(modulesData)
    // .slice(50, 60)
    .forEach(([filePath, currentModule]) => {
      // let importedItems = []
      const imported = currentModule.imports.filter((i) => !i.isExternal)
      const exportAll = currentModule.exports
        .filter((e) => e.type == 'ExportAllDeclaration')
        .map((e) =>
          getPossibleModulePaths(e._sourcePath, extensions).find(
            (e) => modulesData[e]
          )
        )

      if (exportAll.length) {
        allImports = allImports.concat(exportAll.flat())
      }

      imported.forEach((importsData) => {
        const moduleFileName = getPossibleModulePaths(
          importsData._sourcePath,
          extensions
        ).find((p) => modulesData[p])
        const importedModuleData = modulesData[moduleFileName]

        if (!importedItemsByFile[moduleFileName]) {
          importedItemsByFile[moduleFileName] = {
            usedItems: [],
            usedBy: [],
          }
        }

        importedItemsByFile[moduleFileName].usedBy =
          importedItemsByFile[moduleFileName].usedBy.concat(filePath)

        const specifiers =
          currentModule?.imports
            .filter((item) => item._sourcePath === importsData._sourcePath)
            .map((item) => item.specifiers)
            .flat() || []

        // console.log(currentModule.imports)

        if (specifiers.length) {
          // importedItems = importedItems.concat(specifiers)

          importedItemsByFile[moduleFileName].usedItems = _.uniq(
            importedItemsByFile[moduleFileName].usedItems.concat(
              specifiers.filter(
                (specifier) =>
                  !importedItemsByFile[moduleFileName].usedItems.some((item) =>
                    _.isEqual(item, specifier)
                  )
              )
            )
          )
        }

        if (moduleFileName) {
          allImports.push(moduleFileName)
        }

        // if (!moduleData) {
        //   console.log(filePath, modulePath, possibilities.slice(0, 2))
        // }
      })
    })

  return { allImports, importedItemsByFile }
}

module.exports = {
  parseDataByModule,
}
