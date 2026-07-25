import { isExternal } from './pathUtils'

describe('pathUtils', () => {
  describe('isExternal', () => {
    it('returns true if the module has a folder', () => {
      expect(isExternal('lodash/sortBy', ['lodash', 'react'], [])).toBe(true)
    })

    it('returns false if the module is not on the list', () => {
      expect(isExternal('lodash/sortBy', ['react'], [])).toBe(false)
    })
  })
})
