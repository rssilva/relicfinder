import fs from 'fs'
import { ModulesData } from '../types/ModulesData'
import { traverseAst } from '../visitor/visitor'
import { parseCode } from '../visitor/parseCode'

export const parseModules = ({
  filesList,
  path,
  dependencies,
  devDependencies,
}: {
  filesList: string[]
  path: string
  dependencies: string[]
  devDependencies: string[]
}) => {
  const modulesData: ModulesData = {}

  filesList.forEach((filePath: string) => {
    try {
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' })
      const ast = parseCode(content)

      modulesData[filePath] = traverseAst({
        ast,
        filePath,
        basePath: path,
        repoPath: path,
        dependencies,
        devDependencies,
      })
    } catch (e) {
      console.log('error', { filePath }, e)
    }
  })

  return modulesData
}
