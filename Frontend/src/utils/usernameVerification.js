export const usernameVerification = (username) => {
  const usernameRegex = /^[a-zA-Z\s]{4,30}$/
  return usernameRegex.test(username)
}