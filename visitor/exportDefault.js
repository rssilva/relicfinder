const exportDefault = (nodePath) => {
  return {
    type: nodePath.type,
    name: nodePath?.declaration?.name,
    specifiers: [],
    declarationType: nodePath?.node?.declaration?.type,
  }
}

module.exports = {
  exportDefault,
}
