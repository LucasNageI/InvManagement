class ResponseBuilder {
    constructor() {
      this.response = {
        ok: false,
        status: 0,
        message: "",
        data: {},
        code: "",
      }
    }
  
    setOk(ok) {
      this.response.ok = ok
      return this
    }
  
    setMessage(message) {
      this.response.message = message
      return this
    }
  
    setData(data) {
      this.response.data = data
      return this
    }
  
    setCode(code) {
      this.response.code = code
      return this
    }
  
    build() {
      return this.response
    }
  }
  
  export default ResponseBuilder  