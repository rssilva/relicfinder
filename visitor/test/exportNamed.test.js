const { parseCode, traverseAst } = require('../visitor')

describe('exportNamed', () => {
  it('handles local and exportedName', () => {
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
        source: undefined,
      },
    ])
  })

  it('handles exported variables', () => {
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
        source: undefined,
      },
    ])
  })

  it('add specifiers with source', () => {
    const code = `
      export const myVariable = 1
      const variable2 = 2
      export { variable2 }
      export { variable3 } from './otherPath'
    `
    const ast = parseCode(code)
    const res = traverseAst({ ast, filePath: 'src/page.js' })

    expect(res.exports).toEqual([
      {
        type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: undefined,
        declarations: [{ id: 'myVariable' }],
        source: undefined,
      },
      {
        type: 'ExportNamedDeclaration',
        specifiers: [
          {
            exportedName: 'variable2',
            localName: 'variable2',
          },
        ],
        declaration: undefined,
        declarations: [],
        source: undefined,
      },
      {
        type: 'ExportNamedDeclaration',
        specifiers: [
          {
            exportedName: 'variable3',
            localName: 'variable3',
          },
        ],
        declaration: undefined,
        declarations: [],
        source: './otherPath',
        _sourcePath: 'src/otherPath',
      },
    ])
  })
})
