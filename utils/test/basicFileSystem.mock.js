const { parseCode, traverseAst } = require('../../visitor/visitor')

const index = `
      import {getUsers} from 'api'
      import {Button} from 'components'
      import mysteriousFunction from './defaultExport'
    `

const apiIndex = `
      export const getUsers = () => {}
    `

const componentsIndex = `
      export * from './Button'
      export * from './Header'
    `

const buttonIndex = `
      export const Button = 1
    `

const headerIndex = `
      export const Header = 2
    `

const defaultExport = `
      export default () => {}
    `

const modulesData = {
  'index.js': traverseAst({ ast: parseCode(index), filePath: 'index.js' }),
  'api/index.js': traverseAst({
    ast: parseCode(apiIndex),
    filePath: 'api/index.js',
  }),
  'components/index.js': traverseAst({
    ast: parseCode(componentsIndex),
    filePath: 'components/index.js',
  }),
  'components/Button/index.js': traverseAst({
    ast: parseCode(buttonIndex),
    filePath: 'components/Button/index.js',
  }),
  'components/Header/index.js': traverseAst({
    ast: parseCode(headerIndex),
    filePath: 'components/Header/index.js',
  }),
  'defaultExport.js': traverseAst({
    ast: parseCode(defaultExport),
    filePath: 'defaultExport.js',
  }),
}

module.exports = {
  modulesData,
}
