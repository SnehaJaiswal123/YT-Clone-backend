//  high order function used

const asyncHandler=(handlerRequest)=>async(req,res,next)=>{       
    try{
        await handlerRequest(req,res,next);
    }catch(err){
        res.status(err.status.code||500).json({
            success:false,
            message:err.message
        })
    }

}

export {asyncHandler}