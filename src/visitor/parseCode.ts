import { parse, ParseResult } from '@babel/parser'

export const parseCode = (code: string): ParseResult | undefined => {
  try {
    const output = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    })

    return output
  } catch (err) {
    console.log('error at parsing')
    throw new Error(String(err))
  }
}
