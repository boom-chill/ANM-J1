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
    },
    DOB: {
        type: Date,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
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
    },
    encryptedPrivateKey: String,
    publicKey: String,
})

export const userModel = mongoose.model('user', userSchema)
