import mongoose from "mongoose"
import User from "../models/user.models.js"
import Subscribe from "../models/subscriptions.models.js"

const toggleSubscription = async (req, res) => {
  try {
    const {channelId} = req.params
    const subsriberId = req.user?._id;

    const isSubscribed = await Subscribe.findOne({
      channel:channelId,
      subscriber:subsriberId
    })

    if(isSubscribed){
      await Subscribe.findOneAndDelete({
        channel:channelId,
        subscriber:subsriberId
      })
      return res.status(200).json({
        success:true,
        subscription:"Channel unsubscribed"
      })
    }
    else{
      await Subscribe.create({
        channel:channelId,
        subscriber:subsriberId
      }) 
      return res.status(200).json({
        success:true,
        subscription:"Channel subscribed"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error in toggling subscription",
      error:error.message
    })
  }
}

// controller to return subscriber list of a channel
const getUserChannelSubscribers = async (req,res) =>{
  try {
    const {channelId} = req.params
    
    const result = await Subscribe.aggregate([
      {
        $match:{
          channel:new mongoose.Types.ObjectId(channelId)
        }
      },
      {
        $group:{
          _id:'$channel',
          subscribers: { $push: "$subscriber" }
        }
      },
      {
        $lookup:{
          from:'users',
          localField:'subscribers',
          foreignField:'_id',
          as:'channelSubscribers'
        }
      }
    ])    

    return res.status(200).json({
      success:true,
      message:"User channel subscribers fetched",
      channelSubscribers:result[0]?.channelSubscribers
    })

  } catch (err) {
    console.log("Error in getting channel subscribers:",err);
    return res.status(500).json({
      success:false,
      message:"Error in getting user channel subscribers",
      error:err.message
    })
  }
}

// controller to return channel list to which user has subscribed
const getSubscribedChannels = async (req, res) => {
  try {
    const {subscriberId} = req.params
    
    const result = await Subscribe.aggregate([
      {
        $match:{
          subscriber:new mongoose.Types.ObjectId(subscriberId)
        }
      },
      {
        $group:{
          _id:'$subscriber',
          subscriberedTo: { $push: "$channel" }
        }
      },
      {
        $lookup:{
          from:'users',
          localField:'subscriberedTo',
          foreignField:'_id',
          as:'SubscribedChannels'
        }
      }
    ])    

    return res.status(200).json({
      success:true,
      message:"User channel subscribed to fetched",
      SubscribedChannels:result[0]?.SubscribedChannels
    })

  } catch (err) {
    console.log("Error in getting subscribed channels:",err);
    return res.status(500).json({
      success:false,
      message:"Error in getting user channel subscribers",
      error:err.message
    })
  }
}

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}