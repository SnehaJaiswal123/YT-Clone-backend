class ApiError extends Error{
      constructor(
        statusCode,
        message="Something Went Wrong",
        Errors=[]
      ){
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.Errors=Errors
        this.success=false
        this.data=null
      }
}

export {ApiError}