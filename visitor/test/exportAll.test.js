const { parseCode, traverseAst } = require('../visitor')
const { exportAll } = require('../exportAll')

describe('', () => {
  it('', () => {
    const sample = `
      export * from './requests';
    `

    expect(
      traverseAst({ ast: parseCode(sample), filePath: 'src/models/index.js' })
        .exports
    ).toEqual([{ type: 'ExportAllDeclaration', value: './requests' }])
  })
})
