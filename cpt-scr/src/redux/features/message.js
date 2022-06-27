import { createSlice } from '@reduxjs/toolkit'
const initialState = {}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        createChatrooms: (state, action) => {
            return {
                ...action.payload,
            }
        },

        addRecieveMessage: (state, action) => {
            console.log(action.payload)
            if (state[action.payload.chatRoomId]) {
                return {
                    ...state,
                    [action.payload.chatRoomId]: {
                        ...state[action.payload.chatRoomId],
                        messages: [
                            ...state[action.payload.chatRoomId]?.messages,
                            action.payload,
                        ],
                        unread: state[action.payload.chatRoomId]?.unread + 1,
                    },
                }
            } else {
                return {
                    ...state,
                    [action.payload.chatRoomId]: {
                        messages: [action.payload],
                        unread: 1,
                    },
                }
            }
        },

        addSendMessage: (state, action) => {
            if (state[action.payload.chatRoomId]) {
                return {
                    ...state,
                    [action.payload.chatRoomId]: {
                        ...state[action.payload.chatRoomId],
                        messages: [
                            ...state[action.payload.chatRoomId]?.messages,
                            action.payload,
                        ],
                        unread: 0,
                    },
                }
            } else {
                return {
                    ...state,
                    [action.payload.chatRoomId]: {
                        messages: [action.payload],
                        unread: 0,
                    },
                }
            }
        },

        addOpenFrameMessage: (state, action) => {
            if (state[action.payload.chatRoomId]) {
                return {
                    ...state,
                    [action.payload.chatRoomId]: {
                        ...state[action.payload.chatRoomId],
                        messages: [
                            ...state[action.payload.chatRoomId]?.messages,
                            action.payload,
                        ],
                        unread: 0,
                    },
                }
            } else {
                return {
                    ...state,
                    [action.payload.chatRoomId]: {
                        messages: [action.payload],
                        unread: 0,
                    },
                }
            }
        },

        readMessage: (state, action) => {
            return {
                ...state,
                [action.payload]: {
                    ...state[action.payload],
                    unread: 0,
                },
            }
        },

        addReadMessage: (state, action) => {
            return {
                ...state,
                [action.payload.chatRoomId]: {
                    ...action.payload,
                    unread: 0,
                },
            }
        },

        addGetPreMessage: (state, action) => {
            if (state[action.payload.chatRoomId]) {
                const newState = {
                    ...state,
                    [action.payload.chatRoomId]: {
                        ...state[action.payload.chatRoomId],
                        messages: [
                            ...action.payload?.messages,
                            ...state[action.payload.chatRoomId]?.messages,
                        ],
                        seq: action.payload?.seq,
                    },
                }
                return newState
            } else {
                return state
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    createChatrooms,
    addRecieveMessage,
    addSendMessage,
    addOpenFrameMessage,
    readMessage,
    addReadMessage,
    addGetPreMessage,
} = messageSlice.actions

export default messageSlice.reducer
