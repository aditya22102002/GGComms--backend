import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"

import dotenv from "dotenv";
import { setDriver } from "mongoose"
dotenv.config();

const getUsersForSideBar = asyncHandler(async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(new ApiResponse(200, filteredUsers, "Success"))
    } catch (error) {
        res.status(500).json(new ApiError(500, "internal ServerError"))
    }
})


const getMessages = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id
        const senderId = req.user._id;
        const sendName=await User.findById(senderId)
        const rName=await User.findById(id)

        const messages = await Message.find({
            $or: [
                {
                    senderId: senderId,
                    receiverId: id,
                    senderName:sendName.fullname,
                    recName:rName.fullname
                },
                {
                    senderId: id,
                    receiverId: senderId,
                    senderName:rName.fullname,
                    recName:sendName.fullname
                }
            ]
        })
        res.status(200).json(new ApiResponse(200, messages, "Success"))
    } catch (error) {
        res.status(500).json(new ApiError(500, "Internal server error"))
    }
})


const sendMessage = asyncHandler(async (req, res) => {
    try {
        const text = req.body.text
        const id = req.params.id
        const rName=await User.findById(id)
        const senderId = req.user._id
        const sendername=req.user.fullname
        const newMessage = new Message({
            senderId: senderId,
            senderName:sendername,
            recName:rName.fullname,
            receiverId: id,
            text
        });
        await newMessage.save()

        res.status(200).json(new ApiResponse(200, {}, "message uploaded"))
    } catch (error) {
        res.status(500).json(new ApiError(500, "Internal Server ERROR"))
    }
})


export { getUsersForSideBar, getMessages, sendMessage }