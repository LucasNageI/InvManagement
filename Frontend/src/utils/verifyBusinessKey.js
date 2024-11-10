export const verifyBusinessKey = (key) => {
    const keyRegex = /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}$/
    return keyRegex.test(key)
}