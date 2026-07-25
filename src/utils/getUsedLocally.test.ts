import { getUsedLocally } from './getUsedLocally'

describe('getUsedLocally', () => {
  it('detects functions', () => {
    const used = getUsedLocally({
      'test/fixtures/src/components/button/button.tsx': [
        'exportedButOnlyUsedLocally',
        'hotDamn',
      ],
    })

    expect(used['test/fixtures/src/components/button/button.tsx']).toEqual([
      'exportedButOnlyUsedLocally',
    ])
  })

  it('detects exported items used locally but not a callee', () => {
    const used = getUsedLocally({
      'test/fixtures/src/utils/conditionalUseLocally.ts': [
        'conditionally',
        'exportedButUsedLocallyConditionally',
        'conditionalFunc',
      ],
    })

    expect(used['test/fixtures/src/utils/conditionalUseLocally.ts']).toEqual([
      'exportedButUsedLocallyConditionally',
    ])
  })

  it('shadow variables', () => {
    const used = getUsedLocally({
      'test/fixtures/src/utils/shadow.ts': ['helloShadow', 'shadowy'],
    })

    expect(used['test/fixtures/src/utils/shadow.ts']).toEqual([])
  })

  it('jsx', () => {
    const used = getUsedLocally({
      'test/fixtures/src/pages/contact/about/about.tsx': ['Header'],
    })

    expect(used['test/fixtures/src/pages/contact/about/about.tsx']).toEqual([
      'Header',
    ])
  })
})
