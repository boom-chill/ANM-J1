import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isRegisterFetching: false,
    error: '',
    isSuccess: false,
}

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        registerSliceFetch: (state) => {
            return (state = {
                regiter: { ...state },
                isRegisterFetching: true,
                error: '',
                isSuccess: false,
            })
        },
        registerSliceSuccess: (state, action) => {
            return (state = {
                isRegisterFetching: false,
                error: '',
                isSuccess: true,
            })
        },
        registerSliceFail: (state, action) => {
            return (state = {
                isRegisterFetching: false,
                error: action.payload.message,
                isSuccess: false,
            })
        },
    },
})

// Action creators are generated for each case reducer function
export const { registerSliceFetch, registerSliceSuccess, registerSliceFail } =
    registerSlice.actions

export default registerSlice.reducer
