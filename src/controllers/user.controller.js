import User from "../models/user.models.js";
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

export { Register, login };
