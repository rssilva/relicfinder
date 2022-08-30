const exportNamed = (nodePath) => {
  return {
    type: nodePath.type,
    specifiers: nodePath.node.specifiers?.map((specifier) => {
      return {
        localName: specifier.local.name,
        exportedName: specifier.exported.name
      }
    })
  }
}

module.exports = {
  exportNamed
}
