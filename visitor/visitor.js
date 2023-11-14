const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { exportAll } = require('./exportAll')
const { exportNamed } = require('./exportNamed')
const { exportDefault } = require('./exportDefault')
const { importDeclaration } = require('./importDeclaration')

const parseCode = (code) => {
  try {
    const output = parser.parse(code, {
      sourceType: 'module',

      plugins: ['jsx', 'typescript'],
    })

    return output
  } catch (err) {
    return {}
  }
}

const traverseAst = ({
  ast,
  filePath,
  basePath,
  repoPath,
  dependencies = [],
  devDependencies = [],
}) => {
  let data = {
    imports: [],
    exports: [],
  }

  if (!filePath) {
    throw new Error('filepath?')
  }

  traverse(ast, {
    ExportDefaultDeclaration(nodePath) {
      data.exports.push(exportDefault(nodePath))
    },
    ExportAllDeclaration(nodePath) {
      data.exports.push(exportAll({ nodePath, filePath, basePath, repoPath }))
    },
    ExportNamedDeclaration(nodePath) {
      data.exports.push(exportNamed({ nodePath, filePath, basePath, repoPath }))
    },
    ImportDeclaration(nodePath) {
      data.imports.push(
        importDeclaration({
          nodePath,
          filePath,
          basePath,
          repoPath,
          dependencies,
          devDependencies,
        })
      )
    },
  })

  return data
}

const checkUnused = ({ ast, unused, filePath }) => {
  const occur = {}

  if (!filePath) {
    console.log('where are you filepath?', filePath)
    throw new Error('filepath?')
  }

  traverse(ast, {
    Identifier(path) {
      if (path?.node?.name) {
        if (unused.includes(path.node.name)) {
          if (!occur[path.node.name]) {
            occur[path.node.name] = 0
          }

          occur[path.node.name]++
        }
      }
    },
  })

  return occur
}

module.exports = {
  traverseAst,
  parseCode,
  checkUnused,
}
