import fs from 'fs'
import { parseCode } from '../visitor/parseCode'
import { traverseEnter } from '../visitor/visitorLocally'
import _ from 'lodash'

export const getUsedLocally = (varsByFile: Record<string, string[]>) => {
  const usedLocally: Record<string, string[]> = {}
  // let pathName = ''

  Object.entries(varsByFile).forEach(([path, vars]) => {
    // pathName = path.replace(/(\/|\.)/g, '_')
    usedLocally[path] = []
    const code = fs.readFileSync(path).toString()
    const ast = parseCode(code)

    const traversed = traverseEnter({ ast, filePath: path, searchedVars: vars })

    traversed.forEach((node) => {
      const id = _.get(node, 'id.name')
      const callee = _.get(node, 'expression.callee.name')
      const name = _.get(node, 'name', '')
      const generic = id || callee || name
      const hasName = vars.some((varName) => varName === generic)

      // printf(node.isMatch)

      if (generic && hasName) {
        // @ts-expect-error isMatch
        if (node.isMatch) {
          usedLocally[path].push(String(generic))
        }
      }
    })
  })

  const count: Record<string, Record<string, number>> = {}

  Object.entries(usedLocally).forEach(([path, vars]) => {
    count[path] = {}
    vars.forEach((variableName) => {
      count[path][variableName]++
    })
  })

  // console.log(usedLocally)

  Object.entries(usedLocally).forEach(([path, vars]) => {
    vars.forEach((variableName) => {
      if (count[path]?.[variableName] < 2) {
        // usedLocally[path] = usedLocally[path].filter(
        //   (varName) => varName !== variableName,
        // )
      } else {
        usedLocally[path] = _.uniq(usedLocally[path])
      }
    })
  })

  return usedLocally
}
