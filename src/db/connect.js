import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.Mongo_URI}/${process.env.DB_Name}`)
        console.log("DB Connected:",connectionInstance.connection.host);
    }
    catch(err){
            console.log("error in connecting db:",err);
    }
}

export default connectDB;