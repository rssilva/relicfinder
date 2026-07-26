import { getFixturesModulesData } from '../../test/getFixturesModulesData'

describe('parseModules', () => {
  it('parses code adding imports and exports information', async () => {
    const modulesData = await getFixturesModulesData()

    const files = Object.keys(modulesData)
    expect(files).toHaveLength(19)

    files.forEach((file) => {
      const { imports, exports } = modulesData[file]
      expect(exports.length).toBeGreaterThan(-1)
      expect(imports.length).toBeGreaterThan(-1)

      imports.forEach((importData) => {
        expect(importData.isExternal).toBeDefined()

        expect(importData._sourcePath).toBeTruthy()
      })
    })
  })
})
