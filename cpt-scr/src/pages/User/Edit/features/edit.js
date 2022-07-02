import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    iseditFetching: false,
    error: '',
    isSuccess: false,
}

export const editSlice = createSlice({
    name: 'edit',
    initialState,
    reducers: {
        editSliceFetch: (state) => {
            return (state = {
                regiter: { ...state },
                iseditFetching: true,
                error: '',
                isSuccess: false,
            })
        },
        editSliceSuccess: (state, action) => {
            return (state = {
                iseditFetching: false,
                error: '',
                isSuccess: true,
            })
        },
        editSliceFail: (state, action) => {
            return (state = {
                iseditFetching: false,
                error: action.payload.message,
                isSuccess: false,
            })
        },
    },
})

// Action creators are generated for each case reducer function
export const { editSliceFetch, editSliceSuccess, editSliceFail } =
    editSlice.actions

export default editSlice.reducer
