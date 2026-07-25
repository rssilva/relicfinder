import { ModulesData } from '../types/ModulesData'

export const countExternalPackages = (modulesData: ModulesData) => {
  const packages: Map<string, number> = new Map()

  Object.entries(modulesData).forEach(([, moduleData]) => {
    const { imports } = moduleData

    const externals = imports.filter(({ isExternal }) => !!isExternal)

    externals.forEach((external) => {
      packages.set(external.source, (packages.get(external.source) || 0) + 1)
    })
  })

  return packages
}
