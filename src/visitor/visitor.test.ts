import { traverseAst } from './visitor'

describe('visitor', () => {
  describe('traverseAst', () => {
    it('throws error when filePath is empty', () => {
      expect(() =>
        traverseAst({
          ast: {
            type: 'File',
            program: {
              type: 'Program',
              body: [],
              directives: [],
              sourceType: 'script',
            },
            errors: [],
            comments: [],
          },
          filePath: '',
          dependencies: [],
          devDependencies: [],
          basePath: '',
          repoPath: '',
        }),
      ).toThrow('missing filepath')
    })

    it('throws error when ast is falsy', () => {
      expect(() =>
        traverseAst({
          ast: undefined,
          filePath: 'foo',
          dependencies: [],
          devDependencies: [],
          basePath: '',
          repoPath: '',
        }),
      ).toThrow('missing ast to foo')
    })
  })
})
