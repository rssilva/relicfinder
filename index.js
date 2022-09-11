const parser = require('@babel/parser')
const visitor = require('./visitor/visitor')
const fs = require('fs')
const { getFilesList } = require('./utils/getFilesList')
const packageJson = require('./repo/Backend/client/package.json')

const dependencies = Object.keys(packageJson.dependencies)
const devDependencies = Object.keys(packageJson.devDependencies || {})

const extensions = ['js', 'jsx', 'ts', 'tsx']

;(async () => {
  const filesList = await getFilesList(extensions)

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

  fs.writeFileSync('modulesData.json', JSON.stringify(modulesData))
})()
