// models/Channel.js
import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'voice'],
    default: 'text',
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }]
}, { timestamps: true });

export default mongoose.model('Channel', channelSchema);
