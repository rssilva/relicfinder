const { parseCode, traverseAst } = require('../visitor/visitor')
const { exportNamed } = require('../visitor/exportNamed')

describe('', () => {
  it('', () => {
    const code = `
      const a = 1
      const b = 2
      export {a, b}
    `
    const ast = parseCode(code)
    const res = traverseAst(ast)
    console.log(res)
    expect(1).toBe(1)
  })
});
