const { parseCode, traverseAst } = require('../visitor')
// const { exportAll } = require('../exportAll')

describe('', () => {
  it('', () => {
    const sample = `
      export * from './requests';
    `

    expect(
      traverseAst({ ast: parseCode(sample), filePath: 'src/models/index.js' })
        .exports
    ).toEqual([
      {
        _sourcePath: 'src/models/requests',
        type: 'ExportAllDeclaration',
        value: './requests',
      },
    ])
  })
})
