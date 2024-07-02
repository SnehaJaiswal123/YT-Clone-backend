import mongoose from "../db/connect";
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
    ]
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

userSchema.methods.generateToken = async function(password){
      jwt.sign(
        {
            id:this._id,
            email:this.email
        },
        process.env.JWT_Secret,
        {
            expiresIn:"1d"
        }
      )
}

const User = mongoose.model('User',userSchema)

export default User;