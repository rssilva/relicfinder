const { parseCode, traverseAst } = require('../visitor')

describe('ImportDeclaration', () => {
  it('ImportSpecifier and ImportDefaultSpecifier', () => {
    const sample = `
      import { get } from 'api'
      import Model from './models'
    `

    const ast = parseCode(sample)
    const res = traverseAst({ ast, filePath: 'src/api.js' })

    expect(res.imports).toEqual([
      {
        type: 'ImportDeclaration',
        specifiers: [
          {
            name: 'get',
            localName: 'get',
            type: 'ImportSpecifier',
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

  it('ImportNamespaceSpecifier', () => {
    const sample = `
      import * as api from 'api'
    `

    const res = traverseAst({ ast: parseCode(sample), filePath: 'src/api.js' })

    expect(res.imports).toEqual([
      {
        type: 'ImportDeclaration',
        specifiers: [
          {
            name: undefined,
            localName: 'api',
            type: 'ImportNamespaceSpecifier',
          },
        ],
        source: 'api',
        _sourcePath: 'api',
        isExternal: false,
      },
    ])
  })
})
