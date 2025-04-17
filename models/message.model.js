import mongoose, { Schema } from 'mongoose'

const messageSchema=new Schema({
    senderId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            
        }
    ,
    senderName:{
        type:String,
        
    },
    recName:{
        type:String,
        
    },
    receiverId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ,
    text:{
        type:String,
    }
},{timestamps:true})

export const Message = mongoose.model("Message", messageSchema)