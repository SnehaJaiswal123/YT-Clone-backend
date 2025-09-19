import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:[true, 'Full Name is required']
    },
    userName:{
        type:String,
        required:[true, 'User Name is reuired'],
        unique:[true, 'This username already exist'],
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:[true,'This email already exist'],
        lowercase:[true, 'Email is required']
    },
    password:{
        type:String,
        required:[true, 'Password is required']
    },
    avatar:{
        type:String,
        required:[true,'Avatar is required']
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    refreshToken:{
        type:String,
    }
},
{
    timestamps:true
})

userSchema.pre("save",async function(next){
      if(this.isModified("password")){
        this.password=await bcryptjs.hash(this.password,8)
      }
      next()
})

userSchema.methods.isPasswordCorrect = async function(password){    
    const isPassCorrect = await bcryptjs.compare(password, this.password)
    console.log(isPassCorrect);
    return isPassCorrect
    
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id:this._id,
        },
        process.env.AccessToken_Secret,
        {
            expiresIn:"1d"
        }
    )
}

userSchema.methods.generateRefreshToken =  function(){
    return jwt.sign(
        {
            id:this._id,
            email:this.email
        },
        process.env.RefreshToken_Secret,
        {
            expiresIn:"01d"
        }
      )
}

const User = mongoose.model('User',userSchema)

export default User;