import express from 'express'
import {
    getAllChatRooms,
    getMessages,
} from './../controllers/messageManage.controller.js'

const router = express.Router()

//localhost:5000/api/message/previous
router.get('/previous', getMessages)

//localhost:5000/api/message/chat-rooms
router.post('/chat-rooms', getAllChatRooms)

export default router
