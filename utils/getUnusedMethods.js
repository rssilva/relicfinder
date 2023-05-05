const _ = require('lodash')

const getUnusedMethods = ({ modulesData, importedItemsByFile }) => {
  const differences = {}

  Object.entries(modulesData).forEach(([filePath, moduleData]) => {
    const exports = moduleData.exports
      .map((e) => [[...(e.specifiers || [])].concat(e.declarations || [])])
      .flat()
      .filter((item) => item.length)
      .flat()

    if (exports.length !== importedItemsByFile[filePath]?.usedItems.length) {
      differences[filePath] = _.difference(
        exports.map((e) => e.id || e.localName),
        importedItemsByFile[filePath]?.usedItems.map(
          (e) => e.name || e.localName
        )
      )
    }
  })

  return differences
}

module.exports = {
  getUnusedMethods,
}
