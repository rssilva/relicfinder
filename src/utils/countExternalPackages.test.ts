import { getFixturesModulesData } from '../../test/getFixturesModulesData'
import { countExternalPackages } from './countExternalPackages'

describe('countExternalPackages', () => {
  it('count the amount of external packages in all files grouping on a map', async () => {
    const externalCount = countExternalPackages(await getFixturesModulesData())

    expect(externalCount.get('react')).toBe(5)
  })
})
