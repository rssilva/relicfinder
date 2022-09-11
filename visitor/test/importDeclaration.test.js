const { importDeclaration } = require('../importDeclaration')
const { parseCode, traverseAst } = require('../visitor')

describe('', () => {
  it('', () => {
    const sample = `
      import get from 'api'
      import Model from './models'
    `

    const ast = parseCode(sample)

    importDeclaration({
      nodePath: {
        node: {
          type: 'ImportDeclaration',
          importKind: 'value',
          specifiers: [
            {
              type: 'ImportDefaultSpecifier',
              local: {
                type: 'Identifier',
                name: 'get',
              },
            },
          ],
          source: {
            type: 'StringLiteral',
            extra: {
              rawValue: 'api',
              raw: "'api'",
            },
            value: 'api',
          },
        },
      },
    })
  })
})
