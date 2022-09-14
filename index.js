const visitor = require('./visitor/visitor')
const fs = require('fs')
const { getFilesList } = require('./utils/getFilesList')
const _ = require('lodash')
const packageJson = require('./repo/Backend/client/package.json')
// const mock = require('./modulesData.json')
const { parseDataByModule } = require('./utils/parseDataByModule')
const { getUnusedMethods } = require('./utils/getUnusedMethods')

const dependencies = Object.keys(packageJson.dependencies)
const devDependencies = Object.keys(packageJson.devDependencies || {})

const extensions = ['js', 'jsx', 'ts', 'tsx']

const shouldLogUnimportedFiles = false
const shouldLogUnusedMethods = true

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

  const unusedMethods = getUnusedMethods({ modulesData, importedItemsByFile })

  if (shouldLogUnusedMethods) {
    Object.entries(unusedMethods).forEach(([file, data]) =>
      console.log(file, data)
    )
  }

  if (shouldLogUnimportedFiles) {
    const unimportedFiles = _.difference(filesList, _.uniq(allImports.flat()))
    console.log(unimportedFiles)
  }

  // fs.writeFileSync(
  //   'importedItemsByFile.json',
  //   JSON.stringify(importedItemsByFile)
  // )
  // fs.writeFileSync('modulesData.json', JSON.stringify(modulesData))
})()
