import dotenv from 'dotenv'
import connectDB from './db/connect.js'
dotenv.config()

connectDB()
.then(()=>console.log("Db Connected Successfully"))
.catch((err)=>console.log("Db connection failed"))