export const shadowy = () => {}

const hello = () => {
  return ['shadowy'].map((shadowy) => {
    return shadowy
  })
}

export const helloShadow = () => {
  const shadowy = () => {}

  hello()

  shadowy()
}
