// import mongoose from "../db/connect.js";
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    fullname:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
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
        this.password=bcryptjs.hash(this.password,8)
      }
      next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return  await bcryptjs.compare(this.password,password)
}

userSchema.methods.generateAccessToken =  function(){
    return jwt.sign(
        {
            id:this._id,
            email:this.email
        },
        process.env.AcessToken_Secret,
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