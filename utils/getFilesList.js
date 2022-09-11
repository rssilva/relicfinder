const glob = require('glob')

const getFilesList = (extensions) => {
  return new Promise((accept, reject) => {
    const pattern = `repo/Backend/client/src/**/*.{${extensions.join(',')}}`

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
