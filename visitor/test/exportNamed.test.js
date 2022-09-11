const { parseCode, traverseAst } = require('../visitor')
const { exportNamed } = require('../exportNamed')

describe('', () => {
  it('', () => {
    const code = `
      const a = 1
      const b = 2
      export {a, b}
    `
    const ast = parseCode(code)
    const res = traverseAst({ ast, filePath: 'my_path' })
    console.log(res.exports[0])
    expect(1).toBe(1)
  })

  it('', () => {
    const code = `
      export const myVariable = 1
    `
    const ast = parseCode(code)
    const res = traverseAst({ ast, filePath: 'my_path' })
    console.log(res.exports[0])
    expect(1).toBe(1)
  })
})
