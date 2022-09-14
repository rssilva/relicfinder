const { importDeclaration } = require('../importDeclaration')
const { parseCode, traverseAst } = require('../visitor')

describe('', () => {
  it('', () => {
    const sample = `
      import get from 'api'
      import Model from './models'
    `

    const ast = parseCode(sample)
    const res = traverseAst({ ast, filePath: 'src/api.js' })

    expect(res.imports).toEqual([
      {
        type: 'ImportDeclaration',
        specifiers: [
          {
            name: undefined,
            localName: 'get',
            type: 'ImportDefaultSpecifier',
          },
        ],
        source: 'api',
        _sourcePath: 'api',
        isExternal: false,
      },
      {
        type: 'ImportDeclaration',
        specifiers: [
          {
            name: undefined,
            localName: 'Model',
            type: 'ImportDefaultSpecifier',
          },
        ],
        source: './models',
        _sourcePath: 'src/models',
        isExternal: false,
      },
    ])
  })
})
