import User from "../models/user.models.js";
import jwt from 'jsonwebtoken'
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


const Register = async (req,res) => {
  try{
    const {fullName, userName, email, password} = req.body;

    //Fields are not defined
    if(!fullName || !userName || !email || !password){
      return res.status(401).json({
        success:false,
        message:"Some fields are missing",
        data:req.body
      })
    }

    //Empty fields is present
    const missingFields = [fullName, userName, email, password].some((elem)=>{
      return elem.trim()===""
    })

    if(missingFields){
      return res.status(401).json({
        success:false,
        message:"Some fields are empty",
        data:req.body
      })
    }

    //Email exist
    const userExist = await User.findOne({email});
    if(userExist){
      return res.status(401).json({
        success:false,
        message:"User with this email already exist",
        data:req.body
      })
    }

    const userNameExist = await User.findOne({userName});
    if(userNameExist){
      return res.status(401).json({
        success:false,
        message:"User Name is already taken",
        data:req.body
      })
    }

    // Avatar not missing  
    const AvatarfilePath = req.files.avatar?req.files.avatar[0].filename:undefined;  

    if(!AvatarfilePath){
      return res.status(401).json({
        success:false,
        message:"Avatar is missing",
        data:req.body
      })
    }

    // Cover Image null
    const coverImagefilePath = req.files.coverImage?req.files.coverImage[0].fileName:"";
    

    // Create User
    const newUser = new User({
      fullName,
      userName,
      email,
      password,
      avatar:AvatarfilePath,
      coverImage:coverImagefilePath
    })
    
    const createdUser = await newUser.save()
    return res.status(201).json({
      success:true,
      message:"User created successfully",
      data:createdUser
    })
  }
  catch(err){
    console.log(err);  
    return res.status(500).json({
      success:false,
      message:err.message,
      data:req.body
    })
  }
}

const genrateAcessAndRefreshToken = async (userId) =>{
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  
  user.refreshToken=refreshToken;
  await user.save();

  return {accessToken,refreshToken}
}

const login = async (req,res) => {
  try{
    const {userName, email, password} = req.body;

    //Fields are not defined
    if(!userName || !email || !password){
      return res.status(401).json({
        success:false,
        message:"Some fields are missing",
        data:req.body
      })
    }

    //Empty fields is present
    const missingFields = [userName, email, password].some((elem)=>{
      return elem.trim()===""
    })

    if(missingFields){
      return res.status(401).json({
        success:false,
        message:"Some fields are empty",
        data:req.body
      })
    }

    //Email exist
    const user = await User.findOne({
      $or:[{email},{userName}]
    })

    if(!user){
      return res.status(404).json({
        success:false,
        message:"User doesn't exist",
        data:req.body
      })
    }

    const isPassCorrect = await user.isPasswordCorrect(password)
    if(!isPassCorrect){
      return res.status(401).json({
        success:false,
        message:"Invalid Password",
        data:req.body
      })
    }

    const {accessToken, refreshToken} = await genrateAcessAndRefreshToken(user._id);

    const options={
      httpOnly:true,
      secure:true
    }

    return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json({
      success:true,
      message:"User loggedIn successfully",
      data:user
    })
  }
  catch(err){
    console.log(err);  
    return res.status(500).json({
      success:false,
      message:err.message,
      data:req.body
    })
  }
}

const refreshAccessToken = async (req,res) =>{
  try{
    const incomingRefreshToken=req.cookies?.refreshToken||req.headers('Authorization').split(" ")[1];

    if(!incomingRefreshToken){
      return res.status(401).json({
        success:false,
        message:"Unauthorized Access"
      })
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.RefreshToken_Secret);

    const user = user.findById(decodedToken?.id);

    if(!user){
      return res.status(401).json({
        success:false,
        message:"Invalid Refresh Token"
      })
    }

    if(user.refreshToken!==incomingRefreshToken){
      return res.status(401).json({
        success:false,
        message:"Unauthorized Access"
      })
    }

    const {accessToken,refreshToken} = await genrateAcessAndRefreshToken(user._id)

    const options={
      httpOnly:true,
      secure:true
    }

    return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json({
      success:true,
      message:"Access Token refreshed",
    })
  }
  catch(err){
    console.log("Error in refreshing access token:", err);
    return res.status(500).json({
      success:false,
      message:"Refresh Token is not Valid"
    })
    
  }
}

const logout = async (req,res) =>{
  try{
    const userId = req.user?._id;
    
    await User.findByIdAndUpdate(
      userId,
      {
        $set:{
          refreshToken:undefined
        }
      },
      {
        new:true
      }
    )

    const options={
      httpOnly:true,
      secure:true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({
      success:true,
      message:"Logout Successfully"
    })
  }
  catch(err){
    console.log("Error while logggin out",err);
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

const changeCurrentPass = async(req,res) =>{
  try{
    const {oldPass, newPass} = req.body;

    if(!oldPass || !newPass){
      return res.status(400).json({
        success:false,
        message:"Passwords are required"
      })
    }

    const user = await User.findById(req.user?._id)
    
    const isPassCorrect = await user.isPasswordCorrect(oldPass);

    if(!isPassCorrect){
      return res.status(500).json({
        success:false,
        message:"Incorrect old password"
      })
    }

    user.password = newPass;
    await user.save();

    return res.status(200).json({
      success:true,
      message:"Password changed successfully"
    })
  }
  catch(err){
    console.log("Error in changing pass", err);
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

const updateAccountDetails = async (req,res) =>{
  try{
    const {fullName, userName, email} = req.body;

    if(!fullName || !userName || !email){
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    }

    const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
            $set:{
              fullName,
              email,
              userName
            }
          },
          {
            new:true
          }
        ).select("-password -refreshToken")
    
    return res.status(200).json({
      success:true,
      message:"Account details updated",
      user
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:err.message,
    })
  }
}
export { 
  Register, 
  login, 
  logout, 
  refreshAccessToken,
  changeCurrentPass,
  updateAccountDetails,
 };
