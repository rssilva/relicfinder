type Specifier = {
  localName?: string
  exportedName?: string
  type?: string
}

export type ExportSchema = {
  type: string
  name?: string
  specifiers?: Specifier[]
  declarationType?: string
  declaration?: string
  declarations?: {
    id: string
  }[]
  source?: string
  _sourcePath?: string
}
