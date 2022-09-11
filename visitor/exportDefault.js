const exportDefault = (nodePath) => {
  return {
    type: nodePath.type,
    name: nodePath?.declaration?.name,
  }
}

module.exports = {
  exportDefault,
}
