export type ImportSchema = {
  source: string
  _sourcePath: string
  _filePath?: string
  isExternal?: boolean
  specifiers?: {
    name: string | undefined
    localName: string
    type: string
  }[]
}
