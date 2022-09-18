const { parseDataByModule } = require('../parseDataByModule')
let { modulesData } = require('./basicFileSystem.mock')

modulesData = { ...modulesData }

describe('', () => {
  it('', () => {
    const result = parseDataByModule({ modulesData, extensions: ['js'] })

    expect(result.allImports).toEqual([
      'api/index.js',
      'components/index.js',
      'defaultExport.js',
      'components/Button/index.js',
      'components/Header/index.js',
    ])

    expect(result.importedItemsByFile).toEqual({
      'api/index.js': {
        usedItems: [
          { localName: 'getUsers', name: 'getUsers', type: 'ImportSpecifier' },
        ],
        usedBy: ['index.js'],
      },
      'components/index.js': {
        usedItems: [
          { name: 'Button', localName: 'Button', type: 'ImportSpecifier' },
        ],
        usedBy: ['index.js'],
      },
      'defaultExport.js': {
        usedItems: [
          {
            name: undefined,
            localName: 'mysteriousFunction',
            type: 'ImportDefaultSpecifier',
          },
        ],
        usedBy: ['index.js'],
      },
    })
  })
})
