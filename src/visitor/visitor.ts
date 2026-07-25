import { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import { exportDefault } from './exportDefault'
import { exportNamed } from './exportNamed'
import { exportAll } from './exportAll'
import { importDeclaration } from './importDeclaration'
import { ModulesData } from '../types/ModulesData'

type ModuleData = ModulesData[keyof ModulesData]

export const traverseAst = ({
  ast,
  filePath,
  basePath,
  repoPath,
  dependencies = [],
  devDependencies = [],
}: {
  ast: ParseResult | undefined
  filePath: string
  basePath: string
  repoPath: string
  dependencies?: string[]
  devDependencies?: string[]
}) => {
  const data: ModuleData = {
    imports: [],
    exports: [],
  }

  if (!filePath) {
    throw new Error('missing filepath')
  }

  if (!ast) {
    throw new Error(`missing ast to ${filePath}`)
  }

  traverse(ast, {
    ExportDefaultDeclaration(nodePath) {
      data.exports.push(exportDefault(nodePath, filePath))
    },
    ExportAllDeclaration(nodePath) {
      data.exports.push(exportAll({ nodePath, filePath, basePath, repoPath }))
    },
    ExportNamedDeclaration(nodePath) {
      data.exports.push(exportNamed({ nodePath, filePath, basePath, repoPath }))
    },
    ImportDeclaration(nodePath) {
      data.imports.push(
        importDeclaration({
          nodePath,
          filePath,
          basePath,
          repoPath,
          dependencies,
          devDependencies,
        }),
      )
    },
  })

  return data
}
