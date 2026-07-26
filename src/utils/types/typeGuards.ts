import { Declaration, VariableDeclarator } from '@babel/types'

type DeclarationWithId = Declaration & { id: { name: string } }

export const DeclarationGuard = {
  hasId: function (declaration: Declaration): declaration is DeclarationWithId {
    if (!declaration) {
      return false
    }

    return 'id' in declaration
  },
}

type VariableDeclaratorWithName = VariableDeclarator & {
  id: { name: string }
}

export const VariableDeclaratorGuard = {
  hasName: function (
    declaration: VariableDeclarator,
  ): declaration is VariableDeclaratorWithName {
    if (!declaration) {
      return false
    }

    return 'id' in declaration
  },
}
