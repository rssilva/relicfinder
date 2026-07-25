import { getFixturesModulesData } from '../../test/getFixturesModulesData'
import { dfs } from './dfs'

const extensions = ['ts', 'tsx', 'js', 'jsx']

describe('dfs', () => {
  it('handles empty modules data', () => {
    const { graph } = dfs(['test/fixtures/src/main.tsx'], {}, extensions)

    expect(graph).toEqual({
      'test/fixtures/src/main.tsx': {
        exports: [],
        imports: [],
        filePath: '',
      },
    })
  })

  it('returns an object with imports, exports per file', async () => {
    const { graph } = dfs(
      ['test/fixtures/src/main.tsx'],
      await getFixturesModulesData(),
      extensions,
    )

    const files = Object.keys(graph)

    expect(files).toHaveLength(18)

    files.forEach((file) => {
      expect(graph[file].exports.length).toBeGreaterThan(-1)
      expect(graph[file].imports.length).toBeGreaterThan(-1)
      expect(graph[file].filePath).toBeTruthy()
    })
  })
})
