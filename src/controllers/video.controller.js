import mongoose from "mongoose"
import Video from "../models/video.models.js"

const getAllVideos = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, userId, sortBy, sortType } = req.query

      const filter = {
        isPublished:true
      };
      if(search) filter.description = { $regex: new RegExp(search, 'i') }
      if(userId) filter.owner = new mongoose.Types.ObjectId(userId)
      
      const sortFields={
        title:1
      };
      if(sortType) sortFields[sortType]=1;
      if(sortBy) sortFields[sortType]=(sortBy=='asc')?1:-1;
      
      let aggregate = Video.aggregate([
        {
          $match:filter
        }
      ]);
 
      const options={
        page,
        limit
      }
      
      const videos =await Video.aggregatePaginate(aggregate,options)

      return res.status(200).json({
        succes:true,
        message:"Fetched Videos",
        videos:videos.docs
      })
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        succes:false,
        message:"Error in fetching videos",
        error:error._message
      })
    }
}

const getUserAllVideos = async (req, res) => {
    try {
      
      const userId = req.params
 
      const options={
        page,
        limit
      }
      
      const videos =await Video.aggregatePaginate(aggregate,options)

      return res.status(200).json({
        succes:true,
        message:"Fetched Videos",
        videos:videos.docs
      })
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        succes:false,
        message:"Error in fetching videos",
        error:error._message
      })
    }
}

const publishVideo = async (req, res) => {
  try {
    const { title, description} = req.body
  
    if(!title || !description){
      return res.status(404).json({
        success:false,
        message:"Title and Description is required"
      })
    }

    if(title.trim()=='' || description.trim()==''){
      return res.status(404).json({
        success:false,
        message:"Title and Description can't be empty"
      })
    }
    
    if(!req.files.video || !req.files.thumbnail){
      return res.status(404).json({
        success:false,
        message:"Video and Thumbnail is required"
      })
    }
    
    const videoFilePath = req.files.video[0].filename
    const thumbnailFilePath = req.files.thumbnail[0]?.filename

    const newVideo = await Video.create({
      videoFile:videoFilePath,
      title,
      description,
      thumbnail:thumbnailFilePath,
      owner:req.user?._id
    })

    return res.status(201).json({
      success:true,
      message:"Video Published",
      newVideo
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Error in publishing video",
      error:err._message
    })
  }
    
}

const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params
    
    const video = await Video.findById(videoId)

    if(!video){
      return res.status(404).json({
        success:false,
        message:"Video not found"
      })
    }

    return res.status(200).json({
      success:true,
      video
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Error in fetching video"
    })
  }
}

const updateVideo = async (req, res) => {
    try {
      const { videoId } = req.params

      const video = await Video.findById(videoId)

      if(!video){
        return res.status(404).json({
          succes:false,
          message:"Couldn't find the video to delete"
        })
      }
            
      if(!video.owner.equals(req.user._id)){
        return res.status(401).json({
          succes:false,
          message:"User is not authorized to delete video"
        })
      }

      const updatedVideo = await Video.findByIdAndUpdate(
        videoId, 
        { $set: req.body },     
        { new: true }           
      );

      return res.status(200).json({
        succes:true,
        message:"Video Updated",
        updatedVideo
      })

    } catch (error) {
      return res.status(500).json({
        succes:false,
        message:"Error in updating video",
        error:error._message
      })
    }

}

const deleteVideo = async (req, res) => {
    try {
      const { videoId } = req.params

      const video = await Video.findById(videoId)

      if(!video){
        return res.status(404).json({
          succes:false,
          message:"Couldn't find the video to delete"
        })
      }
            
      if(!video.owner.equals(req.user._id)){
        return res.status(401).json({
          succes:false,
          message:"User is not authorized to delete video"
        })
      }

      const deletedVideo = await Video.findByIdAndDelete(videoId)

      return res.status(200).json({
        success:false,
        message:"Video deleted successfully",
        deletedVideo
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Error in deleting video",
        error:error._message
      })
    }
}

const togglePublishStatus = async (req, res) => {
  try {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if(!video){
      return res.status(404).json({
        succes:false,
        message:"Couldn't find the video to delete"
      })
    }
          
    if(!video.owner.equals(req.user._id)){
      return res.status(401).json({
        succes:false,
        message:"User is not authorized to toggle video satus"
      })
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      [{
        $set:{
          isPublished:{ $not: '$isPublished'}
        }
      }],
      {
        new:true
      }
    )

    return res.status(200).json({
      succes:true,
      message:"Status updated",
      updatedVideo
    })
  } catch (error) {
    console.log("Error in toggling status:",error);
    return res.status(500).json({
      succes:false,
      message:"Error in Status Toggle",
      error:error._message
    })
  }

}

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}