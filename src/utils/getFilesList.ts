import { glob } from 'glob'

export const getFilesList = (
  extensions: string[],
  filesDir = './',
): Promise<string[]> => {
  return new Promise((accept) => {
    const pattern = `${filesDir}/**/*.{${extensions.join(',')}}`

    return accept(glob(pattern))
  })
}
