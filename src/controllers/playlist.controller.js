import Playlists from "../models/playlist.models.js"

const createPlaylist = async (req, res) => {
    try {
      const {name, description} = req.body

      if(!name || !description){
        return res.status(404).json({
          success:false,
          message:"Name and description of playlist is required"
        })
      }

      if(name.trim()=="" || description.trim()==""){
        return res.status(404).json({
          success:false,
          message:"Name and description can't be empty"
        })
      }

      const newPlaylist = await Playlists.create({
        name,
        description,
        owner:req.user?._id
      })

      return res.status(201).json({
        success:false,
        message:"Playlist created",
        playlist:newPlaylist
      })

    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error in creating playlist",
        error:error.message
      })
    }
}

const getUserPlaylists = (async (req, res) => {
    try {
      const {userId} = req.params
    
      const userPlaylists = await Playlists.find({owner:userId});

      return res.status(200).json({
        success:true,
        message:"Playlist fetched",
        playlists:userPlaylists
      })

    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error in getting playlists",
      })
    }
})

const getPlaylistById = (async (req, res) => {
    try {
      const {playlistId} = req.params

      const playlist = await Playlists.findById(playlistId)

      if(!playlist){
        return res.status(404).json({
          success:false,
          message:"Playlist not found"
        })
      }

      return res.status(200).json({
        success:true,
        message:"Playlist fetched",
        playlist
      })

    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error in getting playlist"
      })
    }
})

const addVideoToPlaylist = (async (req, res) => {
    try {
      const {playlistId, videoId} = req.params

      const playlist = await Playlists.findByIdAndUpdate(
        playlistId,
        { $push : {videos:videoId} },
        {new : true}
      )

      if(!playlist){
        return res.status(404).json({
          success:false,
          message:"Playlist is not found",
        })
      }

      return res.status(201).json({
        success:true,
        message:"Added video to playlist",
        playlist
      })
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error in Adding video to playlist",
        error:error.message
      })
    }
})

const removeVideoFromPlaylist = (async (req, res) => {
    try {
      const {playlistId, videoId} = req.params

      const playlist = await Playlists.findByIdAndUpdate(
        playlistId,
        { $pull : {videos:videoId} },
        {new : true}
      )

      if(!playlist){
        return res.status(404).json({
          success:false,
          message:"Playlist is not found",
        })
      }

      return res.status(201).json({
        success:true,
        message:"Added video to playlist",
        playlist
      })

    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error in removing video from playlist",
        error:error.message
      })
    }

})

const deletePlaylist = (async (req, res) => {
    try {
      const {playlistId} = req.params

      const playlist = await Playlists.findByIdAndDelete(playlistId)

      if(!playlist){
        return res.status(404).json({
          success:false,
          message:"Playlist not found"
        })
      }

      return res.status(200).json({
        success:true,
        message:"Playlist deleted",
        playlist
      })

    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error in deleting playlist"
      })
    }
})

const updatePlaylist = (async (req, res) => {
    try {
      const {playlistId} = req.params
      const {name, description} = req.body

      const playlist = await Playlists.findByIdAndUpdate(
        playlistId,
        {
          name,
          description
        },
        {
          new:true
        }
      )

      if(!playlist){
        return res.status(404).json({
          success:false,
          message:"Playlist not found"
        })
      }

      return res.status(200).json({
        success:true,
        message:"Playlist updated",
        playlist
      })

    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Error in updating playlist"
      })
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}