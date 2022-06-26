import { userModel } from '../models/user.model.js'
import ChatRoomModel from '../models/chatRoom.model.js'
import ChatBucketModel from '../models/chatBucket.model.js'
import 'dotenv/config'
import { mapChatRoomsUser } from './../utils/mapChatRoomsUser.js'

const MESSAGE_ON_BUCKET = process.env.MESSAGE_ON_BUCKET

export const createSocketChatBucket = async (
    chatRoomId,
    seq,
    messages = []
) => {
    try {
        const newchatBucket = ChatBucketModel.create({
            chatRoomId: chatRoomId,
            seq: seq,
            messages: messages,
        })
        return newchatBucket
    } catch (error) {
        console.log(error)
    }
}

export const addSocketMessageToBucket = async (chatRoomId, message) => {
    try {
        const chatRoom = await ChatRoomModel.findByIdAndUpdate(chatRoomId, {
            $inc: { totalMessage: 1 },
        }).lean()

        console.log('chatRoom', chatRoom)

        const totalMessage = chatRoom.totalMessage

        const seq = Number(Math.floor(totalMessage / MESSAGE_ON_BUCKET))

        if (totalMessage % MESSAGE_ON_BUCKET === 0 && totalMessage !== 0) {
            await createSocketChatBucket(chatRoomId, seq)
        }

        await ChatBucketModel.findOneAndUpdate(
            { chatRoomId: chatRoomId, seq: seq },
            { $push: { messages: message } }
        )
    } catch (error) {
        console.log(error)
    }
}

export const createChatRoom = async (creator, users = [], type) => {
    // _id, email, fullname
    if (type === 'PRIVATE' && users.length === 1) {
        const chatRoom = await ChatRoomModel.findOne({
            type: 'PRIVATE',
            users: {
                $elemMatch: {
                    _id: creator._id,
                    _id: users[0]._id,
                },
            },
        }).lean()

        const totalMessage = chatRoom.totalMessage

        let seq = 0

        if (bucketSeq) {
            seq = bucketSeq
        } else {
            seq = Number(Math.floor(totalMessage / MESSAGE_ON_BUCKET))
            if (totalMessage % MESSAGE_ON_BUCKET == 0 && totalMessage > 0) {
                seq = seq - 1
            }
        }

        if (chatRoom) {
            return {
                [chatRoom._id]: {
                    users: chatRoom.users,
                    name: chatRoom.name,
                    type: chatRoom.type,
                    seq: seq,
                },
            }
        }
    }
    const mappedUsers = users.map((user) => {
        return {
            _id: user._id,
            role: 'user',
        }
    })
    let name = ''

    if (type === 'GROUP') {
        mappedUsers.push({
            _id: creator._id,
            role: 'creator',
        })
        name = `Group of ${creator.fullName}`
    } else {
        mappedUsers.push({
            _id: creator._id,
            role: 'user',
        })
        name = `${creator.fullName} and ${users[0].fullName}`
    }

    const newChatRom = new ChatRoomModel({
        name,
        type,
        totalMessage: 0,
        users: mappedUsers,
    })

    const chatRoom = await newChatRom.save()

    if (type === 'GROUP') {
        // nothing here
    } else {
        // user
        await userModel.findByIdAndUpdate(
            { _id: users[0]._id },
            {
                $push: {
                    chatRooms: {
                        chatRoomId: chatRoom._id,
                        to: creator._id,
                    },
                },
            }
        )

        // creator
        await userModel.findByIdAndUpdate(
            { _id: creator._id },
            {
                $push: {
                    chatRooms: {
                        chatRoomId: chatRoom._id,
                        to: users[0]._id,
                    },
                },
            }
        )
    }

    await await createSocketChatBucket(chatRoom._id, 0)

    return {
        [chatRoom._id]: {
            users: chatRoom.users,
            name: chatRoom.name,
            type: chatRoom.type,
        },
    }
}

export const addSocketMessage = async (message) => {
    const { chatRoomId } = message

    try {
        if (!chatRoomId) {
            return
        } else {
            await addSocketMessageToBucket(chatRoomId, message)
        }
    } catch (error) {
        console.log(error)
    }
}

export const getMessages = async (req, res) => {
    const { bucketSeq, chatRoomId } = req.query
    try {
        if (!chatRoomId) {
            return res.status(500).json({ messsage: 'Cannot load messages' })
        } else {
            const chatRoom = await ChatRoomModel.findOne({
                _id: chatRoomId,
            })

            if (!chatRoom)
                return res
                    .status(500)
                    .json({ messsage: 'Cannot load messages' })

            const totalMessage = chatRoom.totalMessage

            let seq = 0

            if (bucketSeq) {
                seq = bucketSeq
            } else {
                seq = Number(Math.floor(totalMessage / MESSAGE_ON_BUCKET))
                if (totalMessage % MESSAGE_ON_BUCKET == 0 && totalMessage > 0) {
                    seq = seq - 1
                }
            }

            let chatBucket = await ChatBucketModel.findOne({
                chatRoomId: chatRoomId,
                seq: seq,
            })

            if (chatBucket?.messages?.length < 10 && seq > 0) {
                let prevChatBucket = await ChatBucketModel.findOne({
                    chatRoomId: chatRoomId,
                    seq: seq - 1,
                })

                chatBucket.messages = [
                    ...prevChatBucket.messages,
                    ...chatBucket.messages,
                ]

                chatBucket.seq = seq - 1
            }
            res.status(200).json(chatBucket)
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAllChatRooms = async (req, res) => {
    try {
        const { chatRooms } = req.body
        const detailedChatRooms = await mapChatRoomsUser(chatRooms)

        if (!detailedChatRooms)
            return res.status(500).json({ messsage: 'Cannot load chat rooms' })

        return res.status(200).json(detailedChatRooms)
    } catch (error) {
        console.log(error)
    }
}
