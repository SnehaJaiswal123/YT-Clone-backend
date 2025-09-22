import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new mongoose.Schema(
  {
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    Video:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Video'
    },
    Comment:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }
  },
  {
    timestamps:true
  }
)

likeSchema.plugin(mongooseAggregatePaginate)

const Likes = mongoose.model('Like',likeSchema)

export default Likes