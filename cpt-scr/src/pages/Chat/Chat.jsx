import React, { useEffect, useState, useRef } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import './Chat.scss'
import './Chat-frame.scss'
import moment from 'moment'
import { BASE_API_URL } from './../../api/index'
import PrimarySearchAppBar from '../../components/PrimarySearchAppBar/PrimarySearchAppBar'
import { logoutSlice, updateUser } from '../../redux/features/user'
import { Typography } from '@mui/material'
import '../../components/word.scss'
import { useNavigate } from 'react-router-dom'
import {
    addGetPreMessage,
    addRecieveMessage,
    addSendMessage,
    createChatrooms,
} from '../../redux/features/message'
import ImageIcon from '@mui/icons-material/Image'
import SendIcon from '@mui/icons-material/Send'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
// import randomstring from 'randomstring'
// import { encryptRSA } from '../../utils/crypto-RSA'

function Chat(props) {
    const socket = props.socket
    const user = useSelector((state) => state.userState.user)
    const messages = useSelector((state) => state.messageState)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const chatFrameBottomRef = useRef(null)
    const chatFrameTopRef = useRef(null)
    const [searchChatRoom, setSearchChatRoom] = useState([])
    const [searchUsers, setSearchUsers] = useState([])
    const [curChatRoom, setCurChatRoom] = useState('')
    const [chosenUser, setChosenUser] = useState(null)
    const [sendMessage, setSendMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    useEffect(() => {
        const fetchGetChatRooms = async () => {
            if (user) {
                const chatRooms = await axios.post(
                    `${BASE_API_URL}message/chat-rooms`,
                    {
                        chatRooms: user.chatRooms,
                    }
                )
                const detaiedChatRooms = chatRooms.data
                dispatch(createChatrooms(detaiedChatRooms))
            }
        }

        fetchGetChatRooms()
    }, [user])

    useEffect(() => {
        if (!socket) {
            return
        } else {
            socket?.on('receive_message', (data) => {
                console.log(data)
                dispatch(addRecieveMessage(data))
                autoCrollToBottom()
            })
            socket?.on('receive_chatRoom', (data) => {
                dispatch(updateUser(data.user))
                setCurChatRoom(data.chatRoom)
                autoCrollToBottom()
            })
        }
    }, [socket])

    useEffect(() => {
        if (!chatFrameBottomRef && messageList.length < 0) {
            return
        } else {
            autoCrollToBottom()
        }
    }, [messages])

    const autoCrollToBottom = () => {
        if (chatFrameBottomRef) {
            chatFrameBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const onSearchChange = async (value) => {
        const seachRes = await axios.post(`${BASE_API_URL}search`, {
            keyword: value,
        })
        const searchedUsers = seachRes.data.filter(
            (searchUser) => searchUser._id != user._id
        )
        setSearchUsers(searchedUsers)
    }

    const onChooseUser = async (chosenUser) => {
        await socket.emit('create_chatRoom', {
            creator: user,
            users: [chosenUser],
            type: 'private',
        })
        setSearchUsers([])
        setChosenUser(chosenUser)
    }

    const getPrevMessageBucket = async (chatRoom) => {
        autoCrollToBottom()
        if (chatRoom[1]?.messages?.length > 0) return
        const seachRes = await axios.get(`${BASE_API_URL}message/previous`, {
            params: {
                bucketSeq: chatRoom[1].seq,
                chatRoomId: chatRoom[0],
            },
        })
        const messageFromRoom = seachRes.data
        setMessageList(messageFromRoom.messages)
        dispatch(addGetPreMessage(messageFromRoom))
    }

    const handleSendMessage = async () => {
        if (curChatRoom && sendMessage !== '') {
            const messageData = {
                from: user._id,
                to: curChatRoom[1].to._id,
                message: sendMessage,
                chatRoomId: curChatRoom[0] || null,
                messageType: 'MESSAGE',
                time: Date.now(),
            }
            await socket.emit('send_message', messageData)
            dispatch(addSendMessage(messageData))
            setSendMessage('')
        }
    }

    // const generateSessionKey = () => {
    //     return randomstring.generate(100)
    // }

    // const encryptSessionKey = () => {
    //     encryptRSA(publicKey, )
    // }

    const handleSendFile = async (e) => {
        const rfile = e.target.files[0]
        if (rfile) {
            //setSelectedFile(e.target.files[0])
            // console.log(rfile)
            // let data = new FormData()
            // data.append('file', rfile)
            // console.log(data)

            let fileReader = new FileReader()
            fileReader.readAsDataURL(rfile)

            fileReader.onload = async () => {
                const file = {
                    // create new obj file
                    name: rfile.name,
                    size: rfile.size,
                    type: rfile.type,
                    src: fileReader.result,
                    lastModified: rfile.lastModified,
                    lastModifiedDate: rfile.lastModifiedDate,
                    new: true,
                }

                console.log('file', file)

                if (curChatRoom && file) {
                    const messageData = {
                        from: user._id,
                        to: curChatRoom[1].to._id,
                        message: file.name,
                        chatRoomId: curChatRoom[0] || null,
                        messageType: 'FILE',
                        time: Date.now(),
                    }

                    await socket.emit('send_file', {
                        messageData,
                        file: file,
                    })
                }
            }
        }
        e.target.value = ''
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage()
        }
    }

    const handleLogout = () => {
        dispatch(logoutSlice())
        socket.disconnect()
        navigate('/login', { replace: true })
    }

    const handleScroll = (e) => {
        let element = e.target
        if (element.scrollTop === 0) {
            if (curChatRoom) {
                //getPrevMessageBucket(curChatRoom)
            }
        }
    }

    if (!user) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="Chat_container">
            <div style={{ width: '100%' }}>
                <PrimarySearchAppBar
                    user={user}
                    onSearchChange={onSearchChange}
                    searchUsers={searchUsers}
                    onChooseUser={(user) => onChooseUser(user)}
                    handleLogout={() => handleLogout()}
                />
            </div>
            <div className="Chat_wrapper">
                <div className="Chat_queue">
                    {Object.entries(messages)?.map((chatRoom) => (
                        <div
                            key={chatRoom[0]}
                            style={
                                chatRoom[0] == curChatRoom[0]
                                    ? {
                                          backgroundColor: '#b5e2f971',
                                          borderRadius: '6px',
                                      }
                                    : {}
                            }
                            onClick={() => {
                                setCurChatRoom(chatRoom)
                                getPrevMessageBucket(chatRoom)
                            }}
                        >
                            <div
                                key={user._id}
                                className={
                                    chatRoom[0] != curChatRoom[0]
                                        ? 'PrimarySearchAppBar_drop PrimarySearchAppBar_drop_hover'
                                        : 'PrimarySearchAppBar_drop'
                                }
                            >
                                <Typography
                                    style={{
                                        fontWeight: '600',
                                        fontSize: '15px',
                                    }}
                                    component="h2"
                                    className="word-br-1"
                                >
                                    {chatRoom[1].to.fullName}
                                </Typography>
                                <Typography
                                    style={{
                                        fontWeight: '200',
                                        fontSize: '12px',
                                    }}
                                    component="h2"
                                >
                                    {chatRoom[1].to.email}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="Chat_content">
                    <div
                        className="Chat_content--message"
                        onScroll={(e) => handleScroll(e)}
                    >
                        {messages[curChatRoom[0]]?.messages?.map(
                            (messageContent, idx) =>
                                messageContent.from !== user._id ? (
                                    <>
                                        <div
                                            style={{
                                                marginLeft: '17px',
                                                fontSize: '13px',
                                                color: 'gray',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            {curChatRoom[1].to.fullName}
                                        </div>
                                        <div
                                            className="message"
                                            key={idx}
                                            id="you"
                                        >
                                            <div>
                                                <div className="message-content">
                                                    {messageContent.messageType ===
                                                    'FILE' ? (
                                                        <a
                                                            href={`${BASE_API_URL}file/download?path=${messageContent.fileLink}&name=${messageContent.message}`}
                                                            download
                                                        >
                                                            <div className="message-content--file">
                                                                <p>
                                                                    {`${messageContent.message}  `}
                                                                </p>
                                                                <InsertDriveFileIcon />
                                                            </div>
                                                        </a>
                                                    ) : (
                                                        <p>
                                                            {
                                                                messageContent.message
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="message-meta">
                                                    <div id="time">
                                                        {moment(
                                                            messageContent.time
                                                        ).format('hh:mm a')}
                                                    </div>
                                                    {/* <p id="author">
                                                    {messageContent.author}
                                                </p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className="message"
                                        key={idx}
                                        id="other"
                                    >
                                        <div>
                                            <div className="message-content">
                                                {messageContent.messageType ===
                                                'FILE' ? (
                                                    <a
                                                        href={`${BASE_API_URL}file/download?path=${messageContent.fileLink}&name=${messageContent.message}`}
                                                        download
                                                    >
                                                        <div className="message-content--file">
                                                            <InsertDriveFileIcon />
                                                            <p>
                                                                {`  ${messageContent.message}`}
                                                            </p>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <p>
                                                        {messageContent.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="message-meta">
                                                <div id="time">
                                                    {moment(
                                                        messageContent.time
                                                    ).format('hh:mm a')}
                                                </div>
                                                {/* <p id="author">
                                                    {messageContent.author}
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                        )}
                        <div ref={chatFrameBottomRef} />
                    </div>
                    <div className="Chat_content--form">
                        {curChatRoom ? (
                            <>
                                <div>
                                    <input
                                        //accept="image/*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        multiple
                                        type="file"
                                        onChange={(e) => handleSendFile(e)}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button
                                            component="span"
                                            variant="contained"
                                            style={{ marginRight: '10px' }}
                                        >
                                            <ImageIcon />
                                        </Button>
                                    </label>
                                </div>
                                <div className="Chat_content--form--ipt">
                                    <TextField
                                        value={sendMessage}
                                        className="login_form_input"
                                        id="outlined-basic"
                                        variant="outlined"
                                        inputProps={{
                                            style: {
                                                height: '40px',
                                                padding: '0 10px',
                                            },
                                        }}
                                        sx={{
                                            width: '100%',
                                        }}
                                        onChange={(e) =>
                                            setSendMessage(e.target.value)
                                        }
                                        onKeyDown={(e) => handleKeyDown(e)}
                                    />
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: '40px',
                                        }}
                                        onClick={() => handleSendMessage()}
                                    >
                                        <SendIcon />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat
