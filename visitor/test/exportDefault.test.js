const { parseCode, traverseAst } = require('../../visitor/visitor')

describe('exportDefault', () => {
  it('handles simple default exports', () => {
    const sample = `
      export default (n1, n2) => n1 + n2
    `

    const ast = parseCode(sample)
    const res = traverseAst({ ast, filePath: 'src/api.js' })

    expect(res.exports).toEqual([
      {
        type: 'ExportDefaultDeclaration',
        name: undefined,
        specifiers: [],
        declarationType: 'ArrowFunctionExpression',
      },
    ])
  })
})
