import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'

import { createServer } from 'http'
import { Server } from 'socket.io'
import {
    addSocketMessage,
    createChatRoom,
} from './controllers/messageManage.controller.js'

import auth from './routers/auth.route.js'
import file from './routers/file.route.js'
import user from './routers/user.route.js'
import search from './routers/search.route.js'
import message from './routers/message.route.js'
import crypto from './routers/crypto.route.js'
import dotenv from 'dotenv'
import Cryptify from 'cryptify'
import randomstring from 'randomstring'
import { encryptRSA } from './utils/crypto-RSA.js'
import { getUserUtils } from './controllers/user.controller.js'
import { userModel } from './models/user.model.js'
dotenv.config()

const HOST = process.env.HOST
const PORT = process.env.PORT
const DBURL = process.env.DBURL
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET

const app = express()
const server = createServer({}, app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
})

//middleware
app.use('/public', express.static('./public'))
app.use(express.urlencoded({ extended: true, limit: '50000mb' }))
app.use(express.json({ limit: '50000mb' }))
app.use(cors())

//localhost:5000/api/crypto
app.use('/api/crypto', crypto)

//localhost:5000/api/auth
app.use('/api/auth', auth)

//localhost:5000/api/search
app.use('/api/search', search)

//localhost:5000/api/user
app.use('/api/user', user)

//localhost:5000/api/message
app.use('/api/message', message)

//localhost:5000/api/file
app.use('/api/file', file)

let onlineUser = []

const addOnlineUser = (userId, socketId) => {
    const newUser = {
        userId: userId,
        socketId: socketId,
    }
    onlineUser.push(newUser)
}

const removeOnlineUser = (socketId) => {
    if (onlineUser.length > 0)
        onlineUser = onlineUser.filter((user) => user?.socketId !== socketId)
}

mongoose
    .connect(DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log('Connected to DB'))
    .then(async () => {
        try {
            io.on('connection', (socket) => {
                const accessToken = socket.handshake.headers.token

                const decodedData = !accessToken
                    ? ''
                    : jwt.verify(accessToken, ACCESS_TOKEN)

                const userId = decodedData._id

                addOnlineUser(userId, socket.id)

                socket.join(`${userId}`)

                socket.on('send_message', async (data) => {
                    if (data.from && data.chatRoomId) {
                        await addSocketMessage(data)
                        io.to(data.to).emit('receive_message', data)
                    }
                })

                socket.on('send_file', async (data) => {
                    if (data.messageData.from) {
                        //add file
                        const file = data.file
                        const fileName = file.name
                        const chatRoomId = data.chatRoomId
                        const fileId = uuidv4()
                        const fileType = fileName.split('.')[1]
                        const fileData = file.src.split('base64,')[1]
                        const binaryData = new Buffer(fileData, 'base64')
                        const fileLink = `public/files/${fileId}.${fileType}`

                        console.log(fileLink)
                        
                        fs.writeFileSync(
                            fileLink,
                            binaryData,
                            'binary',
                            (err) => {
                                console.log(err)
                            }
                            )

                        const sessionKey = randomstring.generate(15) + "_"
                        const receiveUser = await userModel.findOne({
                            _id: data.messageData.to
                        })

                        const encryptedSessionKey = encryptRSA(receiveUser.publicKey, sessionKey)
                            
                        const instance = new Cryptify(fileLink, sessionKey)
                        await instance
                                .encrypt()
                                .then(files => {
                                    files = encryptedSessionKey + files[0] 
                                    console.log(files)
                                })

                        const sendMessage = {
                            ...data.messageData,
                            fileLink,
                        }

                        await addSocketMessage(sendMessage)
                        io.to(data.messageData.to)
                            .to(data.messageData.from)
                            .emit('receive_message', sendMessage)
                    }
                })

                socket.on('create_chatRoom', async (data) => {
                    const chatRoom = await createChatRoom(
                        data.creator,
                        data.users,
                        data.type
                    )

                    for (const sendUser of [...data.users, data.creator]) {
                        const user = await getUserUtils(sendUser.email)

                        io.to(sendUser._id).emit('receive_chatRoom', {
                            chatRoom,
                            user,
                        })
                    }
                })

                socket.on('connect_error', (err) => {
                    console.log(`connect_error due to ${err.message}`)
                })

                socket.on('disconnect', () => {
                    //console.log('delete room', socket.id)
                    removeOnlineUser(socket.id)
                    console.log(onlineUser)
                })

                console.log(onlineUser)
            })
        } catch (err) {
            console.log('socket', err)
            socket.disconnect()
        }

        server.listen(PORT, () =>
            console.log(`Server is running on ${HOST}:${PORT}`)
        )
    })
    .catch((err) => console.log(err))
