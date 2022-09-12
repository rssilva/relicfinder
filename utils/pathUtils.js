const path = require('path')

const isExternal = (modulePath, dependencies, devDependencies) => {
  if (modulePath.startsWith('./')) {
    return false
  }

  if (modulePath.startsWith('@')) {
    return true
  }

  return [...dependencies, ...devDependencies].some((dependency) => {
    if (dependency === modulePath) {
      return true
    }

    if (dependency === modulePath.replace(/\/.*/, '')) {
      return true
    }
  })
}

const getImportPath = (filePath, sourceValue, basePath = '', repoPath = '') => {
  if (!sourceValue.startsWith('.')) {
    return path.join(repoPath, basePath, sourceValue)
  }

  const folderPath = filePath.replace(/[^/]{1,}$/, '')

  return path.join(folderPath, sourceValue)
}

const getPossibleModulePaths = (sourcePath, extensions = []) => {
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

module.exports = {
  isExternal,
  getImportPath,
  getPossibleModulePaths,
}
