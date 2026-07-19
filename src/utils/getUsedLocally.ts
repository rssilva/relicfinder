import fs from 'fs'
import { parseCode } from '../visitor/parseCode'
import { traverseEnter } from '../visitor/visitorLocally'
import _ from 'lodash'

export const getUsedLocally = (varsByFile: Record<string, string[]>) => {
  const usedLocally: Record<string, string[]> = {}
  let pathName = ''

  Object.entries(varsByFile).forEach(([path, vars]) => {
    pathName = path.replace(/(\/|\.)/g, '_')
    usedLocally[path] = []
    const code = fs.readFileSync(path).toString()
    const ast = parseCode(code)

    const traversed = traverseEnter({ ast, filePath: path })

    traversed.forEach((node) => {
      const name = _.get(node, 'name', '')
      const hasName = vars.some((varName) => varName === name)

      if (name && hasName) {
        usedLocally[path].push(String(name))
      }

      // usedLocally[path] = _.uniq(usedLocally[path])
    })
  })
  const count: Record<string, Record<string, number>> = {}
  Object.entries(usedLocally).forEach(([path, vars]) => {
    count[path] = {}
    vars.forEach((variableName) => {
      if (!count[path][variableName]) {
        count[path][variableName] = 0
      }

      count[path][variableName]++
    })
  })

  Object.entries(usedLocally).forEach(([path, vars]) => {
    vars.forEach((variableName) => {
      if (count[path]?.[variableName] < 2) {
        usedLocally[path] = usedLocally[path].filter(
          (varName) => varName !== variableName,
        )
      } else {
        usedLocally[path] = _.uniq(usedLocally[path])
      }
    })
  })

  return usedLocally
}
