const { parseCode, traverseAst } = require('../visitor')

describe('', () => {
  it('', () => {
    const code = `
      const a = 1
      const b = 2
      export {a as A, b}
    `
    const ast = parseCode(code)
    const res = traverseAst({ ast, filePath: 'my_path' })

    expect(res.exports).toEqual([
      {
        type: 'ExportNamedDeclaration',
        specifiers: [
          { localName: 'a', exportedName: 'A' },
          { localName: 'b', exportedName: 'b' },
        ],
        declaration: undefined,
        declarations: [],
      },
    ])
  })

  it('', () => {
    const code = `
      export const myVariable = 1
    `
    const ast = parseCode(code)
    const res = traverseAst({ ast, filePath: 'my_path' })

    expect(res.exports).toEqual([
      {
        type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: undefined,
        declarations: [{ id: 'myVariable' }],
      },
    ])
  })
})
