const visitor = require('./visitor/visitor')
const fs = require('fs')
const { getFilesList } = require('./utils/getFilesList')
const _ = require('lodash')
// const unusedMock = require('./unusedMethods.json')
const { parseDataByModule } = require('./utils/parseDataByModule')
const { getUnusedMethods } = require('./utils/getUnusedMethods')
const { handleExportAll } = require('./utils/getExportAll')
const { argv } = require('process')
const { getPossibleModulePaths } = require('./utils/pathUtils')

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

const isIgnoredResult = (ignoredResults, file) => {
  let isIgnored = false

  if (ignoredResults.length) {
    ignoredResults?.forEach((ignoredPattern) => {
      try {
        if (RegExp(ignoredPattern, '').test(file)) {
          isIgnored = true
        }
      } catch (e) {
        console.log('invalid regex', e)
      }
    })
  }

  return isIgnored
}

;(async () => {
  const filesList = (await getFilesList(extensions, filesDir)).filter(
    (file) => !/.*\.(stories|test|mock)\./.test(file)
  )

  const modulesData = {}

  filesList.forEach((filePath) => {
    try {
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
    } catch (e) {
      console.log('eeeee', e, filePath)
    }
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

  const ignoredResultsCommand = commandArguments.find((command) =>
    command.startsWith('--ignoredResults')
  )

  let ignoredResults = []

  if (ignoredResultsCommand) {
    ignoredResults = ignoredResultsCommand
      .replace('--ignoredResults=', '')
      .split(',')
  }

  if (shouldLogUnusedMethods) {
    Object.entries(unusedMethods).forEach(([file, data]) => {
      if (data.length) {
        if (!isIgnoredResult(ignoredResults, file)) {
          // console.log(file, data)

          try {
            const content = fs.readFileSync(file, { encoding: 'utf-8' })
            const ast = visitor.parseCode(content)

            const occurrences = visitor.checkUnused({
              ast,
              unused: data,
              filePath: file,
              basePath,
              repoPath,
              dependencies,
              devDependencies,
            })

            console.log(file, occurrences)
          } catch (e) {
            console.log('eeeee', e, file)
          }
        }
      }
    })
  }

  if (shouldLogUnimportedFiles) {
    const unimportedFiles = _.difference(
      [...filesList],
      _.uniq([
        ...allImports.flat(),
        ...exportAllList.map((a) => a.exportPath).flat(),
      ])
    )

    unimportedFiles.forEach((file) => {
      if (!isIgnoredResult(ignoredResults, file)) {
        console.log(file)
      }
    })
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

  console.log('\n\n\n')

  const relationList = {}

  Object.entries(modulesData).forEach(([filePath, data]) => {
    if (!relationList[filePath]) {
      relationList[filePath] = { usedBy: [] }
    }

    data.imports.forEach((importData) => {
      let isPresent = false
      let importPath = ''

      getPossibleModulePaths(importData._sourcePath, extensions).forEach(
        (entirePath) => {
          isPresent = isPresent || !!modulesData[entirePath]

          if (modulesData[entirePath]) {
            importPath = entirePath
          }
        }
      )

      if (importPath) {
        if (!relationList[importPath]) {
          relationList[importPath] = { usedBy: [] }
        }

        importData?.specifiers?.forEach((specifier) => {
          relationList[importPath].usedBy.push({
            specifier: specifier.name,
            type: specifier.type,
            path: filePath,
          })
        })
      }
    })

    data.exports.forEach((exportData) => {
      if (exportData._sourcePath) {
        let isPresent = false
        let exportPath = ''

        getPossibleModulePaths(exportData._sourcePath, extensions).forEach(
          (entirePath) => {
            isPresent = isPresent || !!modulesData[entirePath]

            if (modulesData[entirePath]) {
              exportPath = entirePath
            }
          }
        )

        if (exportPath) {
          if (!relationList[exportPath]) {
            relationList[exportPath] = { usedBy: [] }
          }

          exportData?.specifiers?.forEach((specifier) => {
            relationList[exportPath].usedBy.push({
              // specifier: specifier.name,
              // type: specifier.type,
              ...specifier,
              path: filePath,
            })
          })
        }
      }
    })
  })

  Object.entries(relationList).forEach(([filePath, data]) => {
    const specifiers = data.usedBy.map((item) => item.specifier)
    let exportsTokens = []

    modulesData[filePath]?.exports.forEach((exportItem) => {
      exportsTokens = exportsTokens.concat(
        [
          exportItem.specifiers?.map((specifier) => specifier.name) || [],
          exportItem.declarations?.map((declaration) => declaration.id) || [],
        ].flat()
      )
    })

    const missingTokens = _.difference(_.compact(exportsTokens), specifiers)

    if (missingTokens.length && !isIgnoredResult(ignoredResults, filePath)) {
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' })
      const ast = visitor.parseCode(content)

      const occurrences = visitor.checkUnused({
        ast,
        unused: missingTokens,
        filePath,
        basePath,
        repoPath,
        dependencies,
        devDependencies,
      })

      Object.entries(occurrences).forEach(([token, times]) => {
        if (times < 2) {
          console.log(filePath, token, times)
        }
      })
    }
  })

  const dfs = (pathName) => {
    const stack = [pathName]
    const visited = new Set()
    const data = {}

    while (stack.length != 0) {
      let current = stack.pop()

      if (!visited.has(current)) {
        visited.add(current)

        if (!data[current]) {
          data[current] = {}
        }

        data[current] = {
          exports: modulesData[current]?.exports,
          imports: modulesData[current]?.imports,
        }

        relationList[current]?.usedBy.forEach((item) => stack.push(item.path))
      }
    }

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2))
  }

  const findCyclical = () => {
    const repeated = []

    Object.entries(relationList).forEach(([filePath, data]) => {
      const paths = data.usedBy.map((item) => item.path)

      paths.forEach((path) => {
        const paths2 = relationList[path].usedBy.map((item) => item.path)

        const circular = paths2.find((item) => item === filePath)
        const alreadyLogged = repeated.find((tuple) =>
          _.isEqual([path, filePath].sort(), tuple)
        )

        if (circular && !alreadyLogged) {
          console.log(path, filePath)
          repeated.push([path, filePath].sort())
        }
      })
    })

    return repeated
  }

  // console.log(
  //   dfs()
  // )

  fs.writeFileSync('modulesData.json', JSON.stringify(modulesData, null, 2))
  fs.writeFileSync('relationList.json', JSON.stringify(relationList, null, 2))
})()
