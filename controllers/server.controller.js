// controllers/serverController.js
import Server from '../models/server.model.js';
import Channel from '../models/channel.model.js';
import generateInviteCode from '../utils/generateInviteCode.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createServer = async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.user._id; 

    const inviteCode = generateInviteCode();

    const newServer = new Server({
      name,
      owner: ownerId,
      members: [ownerId],
      inviteCode,
    });

    await newServer.save();

    const textChannel = new Channel({
      name: 'general',
      server: newServer._id,
      type: 'text',
    });

    const voiceChannel = new Channel({
      name: 'General Voice',
      server: newServer._id,
      type: 'voice',
    });

    await textChannel.save();
    await voiceChannel.save();

    // Add channels to server
    newServer.channels.push(textChannel._id, voiceChannel._id);
    await newServer.save();

    res.status(201).json({
      message: 'Server created successfully',
      server: newServer,
    });
  } catch (err) {
    console.error('Create Server Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const joinServer=asyncHandler(async (req,res)=>{
  try {
    const userId=req.user._id;
    const {inviteCode}=req.params

    const server=await Server.findOne({inviteCode})
    if(!server){
      return res.status(404).json(new ApiError(404,"Invalid Invite Code"))
    }

    if(server.members.includes(userId)){
      return res.status(400).json(new ApiError(400,"You are already a member of this server"))
    }
    server.members.push(userId);
    await server.save()

    res.status(200).json(new ApiResponse(200,server,"Successfully joined the Server"))

  } catch (error) {
    console.error('Join Server Error:', error);
    res.status(500).json(new ApiError(500,"Internal server Error"));
  }
})