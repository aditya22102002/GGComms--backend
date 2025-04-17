import mongoose, { Schema } from "mongoose"

const serverSchema = new Schema({
    serverName: {
        type: String,
        required: true
    },
    serverOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    inviteCode: {
        type: String,
        unique: true,
    },
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
    }]
}, { timestamps: true })

export default mongoose.model('Server', serverSchema);