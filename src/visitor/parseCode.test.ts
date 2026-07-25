import { parseCode } from './parseCode'

describe('parseCode', () => {
  it('bubbles up error from babel parsing', () => {
    expect(() => parseCode("const const = 'a'")).toThrow(
      "Unexpected keyword 'const'",
    )
  })
})
