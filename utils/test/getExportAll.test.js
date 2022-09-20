const { handleExportAll } = require('../getExportAll')
const { parseDataByModule } = require('../parseDataByModule')
let { modulesData } = require('./basicFileSystem.mock')

describe('getExportAll', () => {
  it('connects ExportAllDeclaration with the files using the modules', () => {
    const { importedItemsByFile } = parseDataByModule({
      modulesData,
      extensions: ['js'],
    })

    const result = handleExportAll({
      modulesData,
      importedItemsByFile,
      extensions: ['js'],
    })

    expect(result.importedItemsByFile).toEqual({
      'api/index.js': {
        usedItems: [
          {
            name: 'getUsers',
            localName: 'getUsers',
            type: 'ImportSpecifier',
          },
        ],
        usedBy: ['index.js'],
      },
      'components/Input/Input.js': {
        usedItems: [
          {
            localName: 'Input',
            name: 'Input',
            type: 'ImportSpecifier',
          },
        ],
        usedBy: ['components/Input/index.js', 'pages/page1.js'],
      },
      'components/Input/index.js': {
        usedItems: [
          {
            localName: 'Input',
            name: 'Input',
            type: 'ImportSpecifier',
          },
        ],
        usedBy: ['pages/page1.js'],
      },
      'components/index.js': {
        usedItems: [
          {
            name: 'Button',
            localName: 'Button',
            type: 'ImportSpecifier',
          },
        ],
        usedBy: ['index.js'],
      },
      'defaultExport.js': {
        usedItems: [
          {
            localName: 'mysteriousFunction',
            name: undefined,
            type: 'ImportDefaultSpecifier',
          },
        ],
        usedBy: ['index.js'],
      },
      'components/Button/index.js': {
        usedItems: [
          {
            type: 'ExportAllDeclaration',
            value: './Button',
            _sourcePath: 'components/Button',
          },
          {
            name: 'Button',
            localName: 'Button',
            type: 'ImportSpecifier',
          },
        ],
        usedBy: ['components/index.js', 'index.js'],
      },
      'components/Header/index.js': {
        usedItems: [
          {
            type: 'ExportAllDeclaration',
            value: './Header',
            _sourcePath: 'components/Header',
          },
        ],
        usedBy: ['components/index.js', 'index.js'],
      },
    })
  })
})
