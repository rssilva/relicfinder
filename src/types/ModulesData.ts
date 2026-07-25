import { ExportSchema } from './ExportSchema'
import { ImportSchema } from './ImportSchema'

export type ModuleData = {
  exports: ExportSchema[]
  imports: ImportSchema[]
}

export type ModulesData = Record<string, ModuleData>
