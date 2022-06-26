import mongoose from 'mongoose'

const chatBucketSchema = mongoose.Schema(
    {
        chatRoomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roomChats',
            required: true,
        },
        seq: {
            type: Number,
            required: true,
        },
        messages: [
            {
                _id: false,
                from: mongoose.Schema.Types.ObjectId,
                message: {
                    type: String,
                    required: true,
                },
                messageType: {
                    // message, file, link
                    type: String,
                    required: true,
                },
                fileLink: {
                    type: String,
                    required: false,
                },
                time: Date,
            },
        ],
    },
    { timestamp: true }
)

const ChatBucketModel = mongoose.model('chatBuckets', chatBucketSchema)
export default ChatBucketModel
