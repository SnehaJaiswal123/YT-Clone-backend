//  high order function used

const asyncHandler=(handlerRequest)=>async(req,res,next)=>{       
    try{
        await handlerRequest(req,res,next);
    }catch(err){
        console.log("Async Handler Error",err);
        res.status(err.status||500).json({
            success:false,
            message:err.message||"Something went wrong"
        })
    }

}

export default asyncHandler