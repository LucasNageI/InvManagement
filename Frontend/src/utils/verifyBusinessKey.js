export const verifyBusinessKey = (key) => {
  const keyRegex = /^[0-9a-fA-F]{32}$/
  return keyRegex.test(key)
}