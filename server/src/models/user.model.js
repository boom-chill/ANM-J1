import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        unique: true,
    },
    DOB: {
        type: Date,
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    address: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        unique: true,
    },
    chatRooms: [
        {
            chatRoomId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'chatRooms',
            },
            to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                require: false,
            },
            require: true,
            type: Array,
            default: [],
        },
    ],
    refreshToken: {
        type: String,
        unique: true,
    },
})

export const userModel = mongoose.model('user', userSchema)
