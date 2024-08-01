class ApiError extends Error{
      constructor(
        statusCode,
        message="Something Went Wrong",
        Errors=[]
      ){
        console.log("Api Error");
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.Errors=Errors
        this.success=false
        this.data=null
      }
}

export default ApiError