const visitor = require('./visitor/visitor')
const fs = require('fs')
const { getFilesList } = require('./utils/getFilesList')
const _ = require('lodash')
// const unusedMock = require('./unusedMethods.json')
const { parseDataByModule } = require('./utils/parseDataByModule')
const { getUnusedMethods } = require('./utils/getUnusedMethods')
// const { isEqual } = require('lodash')
const { handleExportAll } = require('./utils/getExportAll')
const { argv } = require('process')

const commandArguments = argv.slice(2)

const packageJson = JSON.parse(fs.readFileSync(process.env.PACKAGE_JSON_PATH))
const repoPath = process.env.REPO_PATH
const basePath = process.env.BASE_PATH
const filesDir = process.env.FILES_DIR

const dependencies = Object.keys(packageJson.dependencies)
const devDependencies = Object.keys(packageJson.devDependencies || {})

const extensions = ['js', 'jsx', 'ts', 'tsx']

const shouldLogUnimportedFiles = commandArguments.includes('--logUnimported')
const shouldLogUnusedMethods = commandArguments.includes('--logUnused')

;(async () => {
  const filesList = (await getFilesList(extensions, filesDir)).filter(
    (file) => !/.*\.(stories|test|mock)\./.test(file)
  )

  const modulesData = {}

  filesList.forEach((filePath) => {
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const ast = visitor.parseCode(content)

    modulesData[filePath] = visitor.traverseAst({
      ast,
      filePath,
      basePath,
      repoPath,
      dependencies,
      devDependencies,
    })
  })

  const { allImports, importedItemsByFile } = parseDataByModule({
    modulesData,
    extensions,
  })

  handleExportAll({ modulesData, importedItemsByFile, extensions })

  const unusedMethods = getUnusedMethods({ modulesData, importedItemsByFile })

  // fs.writeFileSync('modulesData.json', JSON.stringify(modulesData))

  if (shouldLogUnusedMethods) {
    Object.entries(unusedMethods).forEach(([file, data]) =>
      console.log(file, data)
    )
  }

  // if (!isEqual(unusedMock, unusedMethods)) {
  //   throw Error('WARNING')
  // }

  if (shouldLogUnimportedFiles) {
    const unimportedFiles = _.difference(filesList, _.uniq(allImports.flat()))
    console.log(unimportedFiles)
  }
})()
