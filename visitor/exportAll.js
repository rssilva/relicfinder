const exportAll = (nodePath) => {
  const node = nodePath.node

  return {
    type: nodePath.type,
    value: node.source?.module || node.source?.value,
  }
}

module.exports = {
  exportAll,
}
