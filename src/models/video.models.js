import mongoose from "../db/connect";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=new mongoose.Schema({
    videoFile:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
{
    timestamps:true
}
)


const Video = mongoose.model('Video',videoSchema)

export default Video;