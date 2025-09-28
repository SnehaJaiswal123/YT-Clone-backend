import Comments from "../models/comment.models.js";

const getVideoComments = async (req,res) =>{
  try {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const aggregate = Comments.aggregate([
      {
        $match:{
          videoId
        }
      }
    ])

    const options = {
      page,
      limit
    }

    const videoComments = await Comments.aggregatePaginate(aggregate,options)

    return res.status(200).json({
      success:true,
      message:"Video Comments fetched",
      videoComments
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in fetching video comments",
    })
  }
}

const addComment = async (req, res) =>{
  try {
    const {videoId} = req.params;
    const {content} = req.body;
    const owner = req.user._id;

    if(!content || content.trim()==""){
      return res.status(404).json({
        success:false,
        message:"Content is required"
      })
    }

    const comment = await Comments.create({
      content,
      videoId,
      owner
    })

    return res.status(201).json({
      success:true,
      message:"Commented Successfully",
      comment
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in commenting"
    })
  }
}

const updateComment = async (req, res) =>{
  try {
    const {commentId} = req.params;
    const {content} = req.body;

    if(!content || content.trim()==""){
      return res.status(404).json({
        success:false,
        message:"Content is required"
      })
    }

    const comment = await Comments.findByIdAndUpdate(
      commentId,
      {
       content,
      },
      {
        new:true
      }
    )

    return res.status(201).json({
      success:true,
      message:"Comment updated Successfully",
      comment
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in comment upadating"
    })
  }
}

const deleteComment = async (req, res) =>{
  try {
    const {commentId} = req.params;

    const comment = await Comments.findByIdAndDelete(commentId)

    if(!comment){
      return res.status(404).json({
        success:false,
        message:"Comment not found"
      })
    }

    return res.status(200).json({
      success:true,
      message:"Comment deleted Successfully",
      comment
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in deleting comment"
    })
  }
}


export {
  getVideoComments, 
  addComment, 
  updateComment,
  deleteComment
}