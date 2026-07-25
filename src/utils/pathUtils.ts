import { ModulesData } from '../types/ModulesData'
import path from 'path'

export const isExternal = (
  modulePath: string,
  dependencies: string[],
  devDependencies: string[],
) => {
  if (modulePath.startsWith('./')) {
    return false
  }

  // if (modulePath.startsWith('@')) {
  //   return true
  // }

  return [...dependencies, ...devDependencies].some((dependency) => {
    if (dependency === modulePath) {
      return true
    }

    if (new RegExp(`^${dependency}/`).test(modulePath)) {
      return true
    }
  })
}

export const getImportPath = (
  filePath: string,
  sourceValue: string,
  basePath = '',
  repoPath = '',
) => {
  if (!sourceValue.startsWith('.')) {
    return path.join(repoPath, basePath, sourceValue.replace(/^@/, ''))
  }

  const folderPath = filePath.replace(/[^/]{1,}$/, '')

  return path.join(folderPath, sourceValue)
}

export const getPossibleModulePaths = (
  sourcePath: string,
  extensions: string[],
) => {
  return [
    sourcePath,
    ...extensions
      .map((extension) => [
        `${sourcePath}.${extension}`,
        `${sourcePath}/index.${extension}`,
      ])
      .flat(),
  ]
}

export const getFullFilePath = (
  filePath: string,
  extensions: string[],
  modulesData: ModulesData,
): string => {
  let isPresent = false
  let importPath = ''

  if (!filePath) {
    throw new Error('no path')
  }

  getPossibleModulePaths(filePath, extensions).forEach((entirePath) => {
    isPresent = isPresent || !!modulesData[entirePath]

    if (modulesData[entirePath]) {
      importPath = entirePath
    }
  })

  return importPath
}
