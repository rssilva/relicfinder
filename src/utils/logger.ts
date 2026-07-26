export const printf = (...rest: unknown[]) => {
  if (Array.isArray(rest)) {
    process.stdout.write(rest.join(', ') + '\n')
  }
}
