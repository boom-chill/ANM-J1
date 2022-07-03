import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { createAction } from '@reduxjs/toolkit'
import { BASE_API_URL } from '../../../api/index'
import apiCall from './../../../sagas/api'
import {
    registerSliceSuccess,
    registerSliceFail,
    registerSliceFetch,
} from '../features/register'

const API = `${BASE_API_URL}auth/register`

function* postRegister(action) {
    const apiArgs = {
        API_CALL: {
            method: 'POST',
            url: API,
            data: action.payload,
            headers: {
                Authorization: '', //`Bearer ${userData.accessToken}`,
            },
        },
        successSlice: registerSliceSuccess,
        failSlice: registerSliceFail,
    }
    yield call(apiCall, apiArgs)
}

export function* registerSaga() {
    yield takeEvery(registerSliceFetch.toString(), postRegister)
}
