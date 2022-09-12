const visitor = require('./visitor/visitor')
const fs = require('fs')
const { getFilesList } = require('./utils/getFilesList')
const _ = require('lodash')
const packageJson = require('./repo/Backend/client/package.json')
const mock = require('./modulesData.json')
const { parseDataByModule } = require('./utils/parseDataByModule')

const dependencies = Object.keys(packageJson.dependencies)
const devDependencies = Object.keys(packageJson.devDependencies || {})

const extensions = ['js', 'jsx', 'ts', 'tsx']

;(async () => {
  const filesList = (await getFilesList(extensions)).filter(
    (file) => !/.*\.(stories|test|mock)\./.test(file)
  )

  const modulesData = {}

  filesList.forEach((filePath) => {
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const ast = visitor.parseCode(content)

    modulesData[filePath] = visitor.traverseAst({
      ast,
      filePath,
      basePath: 'src',
      repoPath: 'repo/Backend/client',
      dependencies,
      devDependencies,
    })
  })

  // const filesList = Object.keys(mock).filter(
  //   (file) => !/.*\.(stories|test|mock)\./.test(file)
  // )

  // const modulesData = mock

  const { allImports, importedItemsByFile } = parseDataByModule({
    modulesData,
    extensions,
  })

  Object.entries(modulesData).forEach(([filePath, moduleData]) => {
    const exports = moduleData.exports
      .map((e) => [[...(e.specifiers || [])].concat(e.declarations || [])])
      .flat()
      .filter((item) => item.length)
      .flat()
    // .flat()

    // console.log(exports)

    if (exports.length > importedItemsByFile[filePath]?.usedItems.length) {
      console.log(
        filePath,
        _.difference(
          exports.map((e) => e.id || e.localName),
          importedItemsByFile[filePath]?.usedItems.map(
            (e) => e.name || e.localName
          )
        )
        // importedItemsByFile[filePath].usedItems
      )
    }
  })

  // const unimported = _.difference(filesList, _.uniq(allImports.flat()))
  // console.log(importedItemsByFile)

  // const unique = _.uniq(importsList.flat())
  // const diff = filesList.filter((file) => !unique.includes(file))
  // console.log(diff)

  // fs.writeFileSync('export-all.json', JSON.stringify(exportAllList.flat()))
  // fs.writeFileSync('unique.json', JSON.stringify(unique))
  fs.writeFileSync(
    'importedItemsByFile.json',
    JSON.stringify(importedItemsByFile)
  )
  // fs.writeFileSync('modulesData.json', JSON.stringify(modulesData))
})()
