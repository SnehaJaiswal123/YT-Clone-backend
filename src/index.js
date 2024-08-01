import dotenv from 'dotenv'
import connectDB from './db/connect.js'
import {app} from './app.js'

dotenv.config()

connectDB()
.then(()=>{
    console.log("Db Connected succesfully");
    app.listen(process.env.PORT||3000,console.log("Server is running on port 3000"))
})
.catch((err)=>console.log("Db connection failed"))