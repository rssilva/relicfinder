const visitor = require('./visitor/visitor')
const fs = require('fs')
const { getFilesList } = require('./utils/getFilesList')
const _ = require('lodash')
// const unusedMock = require('./unusedMethods.json')
const { parseDataByModule } = require('./utils/parseDataByModule')
const { getUnusedMethods } = require('./utils/getUnusedMethods')
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
const shouldLogUnusedPackages = commandArguments.includes('--logUnusedPackages')
const shouldLogPackages = commandArguments.includes('--logPackages')

const usedDependencies = new Map()

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

  const { exportAllList } = handleExportAll({
    modulesData,
    importedItemsByFile,
    extensions,
  })

  const unusedMethods = getUnusedMethods({ modulesData, importedItemsByFile })

  if (shouldLogUnusedMethods) {
    Object.entries(unusedMethods).forEach(([file, data]) =>
      console.log(file, data)
    )
  }

  if (shouldLogUnimportedFiles) {
    const unimportedFiles = _.difference(
      [...filesList],
      _.uniq([
        ...allImports.flat(),
        ...exportAllList.map((a) => a.exportPath).flat(),
      ])
    )
    console.log(unimportedFiles)
  }

  if (shouldLogPackages || shouldLogUnusedPackages) {
    Object.keys(modulesData).forEach((file) => {
      modulesData[file]?.imports
        .filter((a) => a.isExternal)
        ?.map((a) => a.source)
        .forEach((source) => {
          usedDependencies.set(
            source,
            Number(usedDependencies.get(source) || 0) + 1
          )
        })
    })

    if (shouldLogPackages) {
      console.log(usedDependencies)
    }

    if (shouldLogUnusedPackages) {
      const usedPackages = Array.from(usedDependencies).map((arr) => arr[0])
      console.log(_.difference([...dependencies], usedPackages))
    }
  }
})()
