const glob = require('glob')

const getFilesList = (extensions, filesDir = './') => {
  return new Promise((accept, reject) => {
    const pattern = `${filesDir}/**/*.{${extensions.join(',')}}`

    glob(pattern, (err, list) => {
      if (err) {
        reject(err)
      }

      accept(list)
    })
  })
}

module.exports = {
  getFilesList,
}
