const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const { exportAll } = require('./exportAll')
const { exportNamed } = require('./exportNamed')

const parseCode = (code) => {
  try {
    const output = parser.parse(code, {
      sourceType: "module",

      plugins: ["jsx", "typescript"]
    })

    return output
  } catch (err) {
    return {}
  }
}

const traverseAst = (ast) => {
  let data = {}

  traverse(ast, {
    ExportDefaultDeclaration(nodePath) {
      // res.push({ ...path.node.loc, node: path.node })
      // console.log(nodePath)
      // data['export'] = nodePath
    },
    ExportAllDeclaration(nodePath) {
      data = exportAll(nodePath)
    },
    ExportNamedDeclaration(nodePath) {
      data = exportNamed(nodePath)
    }
  })

  return data
}

module.exports = {
  traverseAst,
  parseCode
}