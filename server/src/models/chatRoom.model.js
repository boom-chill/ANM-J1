import mongoose from 'mongoose'

const chatRoomSchema = mongoose.Schema(
    {
        name: String,
        type: { // private, group
            type: String,
            required: true,
        },
        totalMessage: {
            type: Number,
            default: 0,
            require: true,
        },
        users: [
            {
                _id: { 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                    required: true,
                },
                role: {
                    type: String,
                    required: false,
                    default: 'user'
                }
            },
        ],
    },
    { timestamp: true }
)

const ChatRoomModel = mongoose.model('chatRooms', chatRoomSchema)
export default ChatRoomModel
