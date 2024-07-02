class ApiResponse{
    construcor(statuCode,data,message="success"){
        this.statuCode=statuCode
        this.message=message
        this.data=data
        this.success=statuCode<400
    }
}

export {ApiResponse}