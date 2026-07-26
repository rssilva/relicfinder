export const conditionally = () => {}

const what = () => {
  return true
}

export const exportedButUsedLocallyConditionally = () => {}

export const conditionalFunc = what()
  ? exportedButUsedLocallyConditionally
  : () => {}
