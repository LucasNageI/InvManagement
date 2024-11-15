export const passwordVerification = (password) => {
  //8 digitos minimo, solo caracteres como !@#$%^&*_, mayusculas, minusculas y numeros
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[a-zA-Z\d!@#$%^&*_]{8,}$/

  return passwordRegex.test(password)
}