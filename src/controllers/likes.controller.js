import Likes from "../models/like.models.js";

const toggleVideoLike = async(req, res) =>{
  try {
    const {videoId} = req.params;

    const owner = req.user?._id;

    const isVideoLiked = await Likes.findOne({
      owner,
      videoId
    })

    if(isVideoLiked){
      await Likes.findOneAndDelete(isVideoLiked);
      return res.status(200).json({
        success:true,
        message:"Video unliked"
      })
    }

    await Likes.create({owner,videoId});
    return res.status(200).json({
      success:true,
      message:"Video liked"
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in toggling video like"
    })
  }
}

const toggleCommentLike = async(req, res) =>{
  try {
    const {commentId} = req.params;

    const owner = req.user?._id;

    const isCommentedLiked = await Likes.findOne({
      owner,
      commentId
    })

    if(isCommentedLiked){
      await Likes.findOneAndDelete(isCommentedLiked);
      return res.status(200).json({
        success:true,
        message:"comment unliked"
      })
    }

    await Likes.create({owner,commentId});
    return res.status(200).json({
      success:true,
      message:"comment liked"
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in toggling comment like"
    })
  }
}

const getLikedVideos = async(req,res) => {
  try {
    const likedVideos = await Likes.find({
      owner:req.user?._id,
      commentId:undefined
    })

    return res.status(200).json({
      success:true,
      message:"All liked video fetched",
      videos:likedVideos
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in getting liked videos"
    })
  }
}

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}