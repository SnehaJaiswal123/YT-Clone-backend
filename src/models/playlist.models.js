import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true
    },
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    videos:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Video',
      required:true
      }
    ]
  },
  {
    timestamps:true
  }
)

playlistSchema.plugin(mongooseAggregatePaginate)

const Playlists = mongoose.model('Playlist',playlistSchema)

export default Playlists