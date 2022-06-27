import { createSlice } from '@reduxjs/toolkit'
import jwt_decode from 'jwt-decode'
import { removeLocalStorage, setLocalStorage } from '../../utils/localStorage'
import { getLocalStorage } from './../../utils/localStorage'

const initialState = {
    user: null,
    isUserFetching: false,
    error: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUserSliceFetch: (state) => {
            return (state = {
                ...state,
                user: null,
                isUserFetching: true,
            })
        },
        getUserSliceSuccess: (state, action) => {
            const decodedUser = jwt_decode(action.payload.accessToken)
            const user = {
                ...action.payload,
                email: decodedUser.email,
                _id: decodedUser._id,
            }
            setLocalStorage('user', user)
            return (state = {
                ...state,
                user: user,
                isUserFetching: false,
            })
        },
        getUserSliceFail: (state) => {
            //removeLocalStorage('user')
            return (state = {
                ...state,
                user: null,
                isUserFetching: false,
            })
        },
        updateUser: (state, action) => {
            const decodedUser = jwt_decode(action.payload.accessToken)
            const user = {
                ...action.payload,
                email: decodedUser.email,
                _id: decodedUser._id,
            }
            return (state = {
                ...state,
                user: user,
                isUserFetching: false,
            })
        },
        loginSliceFetch: (state) => {
            removeLocalStorage('user')
            return (state = {
                ...state,
                user: null,
                isUserFetching: true,
            })
        },
        loginSliceSuccess: (state, action) => {
            const decodedUser = jwt_decode(action.payload.accessToken)
            const user = {
                ...action.payload,
                email: decodedUser.email,
                _id: decodedUser._id,
            }
            setLocalStorage('user', user)
            return (state = {
                user: user,
                isUserFetching: false,
                error: '',
            })
        },
        loginSliceFail: (state, action) => {
            removeLocalStorage('user')
            return (state = {
                user: null,
                isUserFetching: false,
                error: action.payload.message,
            })
        },
        logoutSlice: (state) => {
            removeLocalStorage('user')
            return (state = {
                user: null,
                isUserFetching: false,
                error: '',
            })
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    updateUser,
    getUserSliceFetch,
    getUserSliceSuccess,
    getUserSliceFail,
    loginSliceFetch,
    loginSliceSuccess,
    loginSliceFail,
    logoutSlice,
} = userSlice.actions

export default userSlice.reducer
