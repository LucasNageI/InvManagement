const getAuthToken = () => {
    const authToken = sessionStorage.getItem('auth_token')
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      }
  }

  export default getAuthToken