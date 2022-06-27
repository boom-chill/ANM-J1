import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { createAction } from '@reduxjs/toolkit'
import { BASE_API_URL } from '../../../api/index'
import apiCall from './../../../sagas/api'
import {
    loginSliceSuccess,
    loginSliceFail,
    loginSliceFetch,
} from '../../../redux/features/user'

const API = `${BASE_API_URL}auth/register`

function* postLogin(action) {
    const apiArgs = {
        API_CALL: {
            method: 'POST',
            url: API,
            data: action.payload,
            headers: {
                Authorization: '', //`Bearer ${userData.accessToken}`,
            },
        },
        successSlice: loginSliceSuccess,
        failSlice: loginSliceFail,
    }
    yield call(apiCall, apiArgs)
}

export function* loginSaga() {
    yield takeEvery(loginSliceFetch.toString(), postLogin)
}
