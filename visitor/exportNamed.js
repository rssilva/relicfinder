const exportNamed = (nodePath) => {
  const node = nodePath.node

  return {
    type: nodePath.type,
    specifiers:
      node.specifiers?.map((specifier) => {
        return {
          localName: specifier.local.name,
          exportedName: specifier.exported.name,
        }
      }) || [],
    declaration: node.declaration?.id?.name,
    declarations:
      node.declaration?.declarations?.map((declaration) => {
        return {
          id: declaration?.id?.name,
        }
      }) || [],
  }
}

module.exports = {
  exportNamed,
}
