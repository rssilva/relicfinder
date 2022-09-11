const { getImportPath, isExternal } = require('../pathUtils')

describe('pathUtils', () => {
  describe('isExternal', () => {
    it('', () => {
      const result = isExternal('toast/style.min.css', ['lodash', 'toast'], [])

      expect(result).toBeTruthy()
    })
  })

  describe('', () => {
    it('', () => {
      const result = getImportPath(
        'repo/client/src/api/general.js',
        './foo/bar'
      )
      expect(result).toEqual('repo/client/src/api/foo/bar')

      expect(
        getImportPath('repo/client/src/api/general.js', '../users')
      ).toEqual('repo/client/src/users')

      expect(
        getImportPath(
          'repo/client/src/api/general.js',
          'api',
          'src',
          'repo/client'
        )
      ).toEqual('repo/client/src/api')
    })
  })
})
