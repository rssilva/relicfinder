const exportAll = (nodePath) => {
  return {
    type: nodePath.type,
    value: nodePath.source.module
  }
}

module.exports = {
  exportAll
}
