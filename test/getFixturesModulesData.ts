import fs from 'fs'
import { getFilesList } from '../src/utils/getFilesList'
import { parseModules } from '../src/utils/parseModules'

const fixturesPath = './test/fixtures/src'

const packageJson = JSON.parse(
  fs.readFileSync('./test/fixtures/package.json').toString(),
)
const dependencies = Object.keys(packageJson.dependencies)
const devDependencies = Object.keys(packageJson.devDependencies || {})

export const getFixturesModulesData = async () => {
  const filesList = (
    await getFilesList(['js', 'ts', 'tsx'], fixturesPath)
  ).filter(
    (item) => !/node_modules/.test(item) && item && !/.*\.d\.ts$/.test(item),
  )

  const modulesData = parseModules({
    filesList,
    path: 'fixturesPath',
    dependencies,
    devDependencies,
  })

  return modulesData
}
