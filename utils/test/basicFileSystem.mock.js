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

const Input = `
  export const Styles = 'beautiful'
  export const Input = 'input'
`

const InputIndex = `
  const utility = 1
  export { utility }
  export { Input } from './Input'
`

const page1 = `
  import {Input} from '../components/Input'
`

const parseAndTraverse = (code, path) =>
  traverseAst({ ast: parseCode(code), filePath: path })

const modulesData = {
  // 'index.js': traverseAst({ ast: parseCode(index), filePath: 'index.js' }),
  'index.js': parseAndTraverse(index, 'index.js'),
  'api/index.js': parseAndTraverse(apiIndex, 'api/index.js'),
  'components/index.js': parseAndTraverse(
    componentsIndex,
    'components/index.js'
  ),
  'components/Button/index.js': parseAndTraverse(
    buttonIndex,
    'components/Button/index.js'
  ),
  'components/Header/index.js': parseAndTraverse(
    headerIndex,
    'components/Header/index.js'
  ),
  'components/Input/Input.js': parseAndTraverse(
    Input,
    'components/Input/Input.js'
  ),
  'components/Input/index.js': parseAndTraverse(
    InputIndex,
    'components/Input/index.js'
  ),
  'pages/page1.js': parseAndTraverse(page1, 'pages/page1'),
  'defaultExport.js': parseAndTraverse(defaultExport, 'defaultExport.js'),
}

module.exports = {
  modulesData,
}
