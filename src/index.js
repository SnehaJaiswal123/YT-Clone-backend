import dotenv from 'dotenv'
import connectDB from './db/connect.js'
import {app} from './app.js'

dotenv.config()

connectDB()
.then(()=>{
    console.log("Db Connected succesfully");
    app.listen(process.env.PORT,console.log("Server is running"))
})
.catch((err)=>console.log("Db connection failed"))