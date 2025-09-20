import jwt from 'jsonwebtoken'
import User from '../models/user.models.js';

const jwtVerify = async (req,res,next) => {
  try{
    const token = req.cookies?.accessToken || req.header('Authorization')?.split(" ")[1];    

    if(!token){
      return res.status(404).json({
        success:false,
        message:"Unauthorized access"
      })
    }
        
    const decodedToken = jwt.verify(token,process.env.AccessToken_Secret);

    console.log(decodedToken);
    

    const user = await User.findById(decodedToken?.id).select("-password -refreshToken")

    if(!user){
      return res.status(404).json({
        success:false,
        message:"Authorization failed, Invalid Access Token"
      })
    }

    req.user = user;
    next()
  }
  catch(err){
    console.log("error in jwt verification:",err)
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

export default jwtVerify
