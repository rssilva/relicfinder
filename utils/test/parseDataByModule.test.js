const { parseDataByModule } = require('../parseDataByModule')
const { parseCode, traverseAst } = require('../../visitor/visitor')

describe('', () => {
  it('', () => {
    const index = `
      import {getUsers} from 'api'
      import {Button} from 'components'
    `

    const apiIndex = `
      export const getUsers = () => {}
    `

    const componentsIndex = `
      export * from './Button'
      export * from './Header'
    `

    const buttonIndex = `
      export const Button = 1
    `

    const headerIndex = `
      export const Header = 2
    `

    const modulesData = {
      'index.js': traverseAst({ ast: parseCode(index), filePath: 'index.js' }),
      'api/index.js': traverseAst({
        ast: parseCode(apiIndex),
        filePath: 'api/index.js',
      }),
      'components/index.js': traverseAst({
        ast: parseCode(componentsIndex),
        filePath: 'components/index.js',
      }),
      'components/button/index.js': traverseAst({
        ast: parseCode(buttonIndex),
        filePath: 'components/button/index.js',
      }),
      'components/header/index.js': traverseAst({
        ast: parseCode(headerIndex),
        filePath: 'components/button/index.js',
      }),
    }

    // console.log(modulesData['index.js'].imports[0])

    const result = parseDataByModule({ modulesData, extensions: ['js'] })
    console.log(result.allImports, result.importedItemsByFile)

    expect(result.importedItemsByFile['api/index.js']).toEqual({
      usedItems: [
        { localName: 'getUsers', name: 'getUsers', type: 'ImportSpecifier' },
      ],
      usedBy: ['index.js'],
    })
  })
})
