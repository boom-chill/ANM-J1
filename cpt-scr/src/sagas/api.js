import { call, put, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

export default function* apiCall(payload) {
    const { API_CALL, successSlice, failSlice } = payload
    try {
        const apiResponse = yield call(axios, API_CALL)
        yield put(successSlice(apiResponse?.data))
    } catch (error) {
        yield put(failSlice(error?.response?.data))
    }
}
