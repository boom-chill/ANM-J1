import React, { useEffect, useState } from 'react'
import './App.css'

import { io } from 'socket.io-client'
import { BASE_URL } from './api/index'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import { getUserSliceFetch, updateUser } from './redux/features/user'
import { getLocalStorage } from './utils/localStorage'
import Register from './pages/Register/Register'
import Edit from './pages/User/Edit/Edit'
import ChangePassword from './pages/User/ChangePassword/ChangePassword'

function App() {
    const user = useSelector((state) => state.userState.user)
    //const socket = useSelector((state) => state.socketState.channel)
    const [socket, setSocket] = useState(null)

    const userFromLocal = getLocalStorage('user')

    const dispatch = useDispatch()

    useEffect(() => {
        if (userFromLocal) {
            dispatch(
                getUserSliceFetch({
                    _id: userFromLocal._id,
                })
            )
        }
    }, [])

    useEffect(() => {
        const connectSocket = async () => {
            if (!user) return

            if (!socket) {
                const newSocket = io(BASE_URL, {
                    extraHeaders: {
                        token: userFromLocal.accessToken,
                    },
                })
                setSocket(newSocket)
            }
        }

        connectSocket()

        return () => {
            if (!user) return
            socket?.disconnect()
        }
    }, [user])

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Chat socket={socket} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat socket={socket} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/change-password"
                    element={
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/edit"
                    element={
                        <ProtectedRoute>
                            <Edit />
                        </ProtectedRoute>
                    }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<p>There's nothing here: 404!</p>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
