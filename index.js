const parser = require('@babel/parser')
const visitor = require('./visitor/visitor')

const sample = `
  const a1 = 1
  const b1 = 2

  export const sum = (a, b) => a + b
  export default (a, b) => a + b
`

const ast = parser.parse(sample, {
  sourceType: "module",

  plugins: ["jsx", "typescript"]
})

const data = visitor.traverseAst(ast)
console.log(data)