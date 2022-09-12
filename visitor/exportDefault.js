const exportDefault = (nodePath) => {
  return {
    type: nodePath.type,
    name: nodePath?.declaration?.name,
    specifiers: [],
  }
}

module.exports = {
  exportDefault,
}
