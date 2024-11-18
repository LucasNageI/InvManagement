export const emailVerification = (email) => {
    const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
    if (!emailRegex.test(email)) {
      return "Invalid email format"
    }
    return null
  }

export const verifyString = (field_name, field_value) => {
  if (typeof field_value !== "string" || field_value.trim() === "") {
    return `${field_name} must be a valid string`
  }
  return null
}

export const verifyMinLength = (field_name, field_value, min_length) => {
  if (field_value.length < min_length) {
    return `${field_name} must be at least ${min_length} characters long`
  }
  return null
}