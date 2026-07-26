import { getFixturesModulesData } from '../../test/getFixturesModulesData'
import { dfs } from './dfs'
import { getUnusedExports } from './getUnusedExports'
import { getUsedCode } from './getUsedCode'

const extensions = ['ts', 'tsx', 'js', 'jsx']

describe('getUnusedExports', () => {
  it('returns exports that are not used outside', async () => {
    const modulesData = await getFixturesModulesData()
    const { graph } = dfs(
      ['test/fixtures/src/main.tsx'],
      modulesData,
      extensions,
    )
    const usedCode = getUsedCode({ graph, extensions, modulesData })

    const unused = getUnusedExports({ graph, usedCode })

    expect(unused).toEqual({
      'test/fixtures/src/pages/index.ts': ['MainPage'],
      'test/fixtures/src/components/paragraph/p2.tsx': ['P2Type', 'P2'],
      'test/fixtures/src/pages/contact/about/about.tsx': ['Header'],
      // TODO: should this be true?
      'test/fixtures/src/components/badge/index.ts': ['Badge'],
      'test/fixtures/src/components/button/button.tsx': [
        'exportedButOnlyUsedLocally',
        'hotDamn',
      ],
      'test/fixtures/src/pages/contact/address/address.tsx': ['AddressPage'],
      'test/fixtures/src/pages/main/main.tsx': ['MainPage'],
      'test/fixtures/src/utils/conditionalUseLocally.ts': [
        'conditionally',
        'exportedButUsedLocallyConditionally',
      ],
      'test/fixtures/src/utils/shadow.ts': ['shadowy'],
      'test/fixtures/src/utils/time.ts': ['formatDay', 'formatMonth'],
    })
  })
})
