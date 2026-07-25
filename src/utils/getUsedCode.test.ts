import { getFixturesModulesData } from '../../test/getFixturesModulesData'
import { dfs } from './dfs'
import { getUsedCode } from './getUsedCode'
import { stringify } from './stringify'

const extensions = ['ts', 'tsx', 'js', 'jsx']

describe('getUsedCode', () => {
  it('formats code that is used by other modules', async () => {
    const modulesData = await getFixturesModulesData()
    const { graph } = dfs(
      ['test/fixtures/src/main.tsx'],
      modulesData,
      extensions,
    )

    const used = getUsedCode({ graph, extensions, modulesData })

    expect(JSON.parse(stringify(used))).toEqual({
      'test/fixtures/src/App.tsx': {
        App: {
          usedBy: ['test/fixtures/src/main.tsx'],
          type: 'TBD',
        },
      },
      'test/fixtures/src/pages/contact/about/about.tsx': {
        AboutPage: {
          usedBy: ['test/fixtures/src/App.tsx'],
          type: 'TBD',
        },
      },
      'test/fixtures/src/components/image/image.tsx': {
        __DEFAULT: {
          usedBy: ['test/fixtures/src/App.tsx'],
          type: 'TBD',
        },
      },
      'test/fixtures/src/utils/conditionalUseLocally.ts': {
        conditionalFunc: {
          type: 'TBD',
          usedBy: ['test/fixtures/src/App.tsx'],
        },
      },
      'test/fixtures/src/utils/shadow.ts': {
        helloShadow: {
          type: 'TBD',
          usedBy: ['test/fixtures/src/App.tsx'],
        },
      },
      'test/fixtures/src/components/paragraph/p1.tsx': {
        P1: {
          usedBy: ['test/fixtures/src/App.tsx'],
          type: 'TBD',
        },
      },
      'test/fixtures/src/components/badge/badge.tsx': {
        Badge: {
          usedBy: ['test/fixtures/src/pages/contact/about/about.tsx'],
          type: 'TBD',
        },
      },
      'test/fixtures/src/components/button/button.tsx': {
        Button: {
          usedBy: [
            'test/fixtures/src/App.tsx',
            'test/fixtures/src/pages/contact/about/about.tsx',
          ],
          type: 'TBD',
        },
      },
    })
  })
})
