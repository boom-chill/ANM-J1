import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { BASE_API_URL } from './../../../../api/index'
import {
    editSliceSuccess,
    editSliceFail,
    editSliceFetch,
} from '../features/edit'
import apiCall from '../../../../sagas/api'
import { getUserSliceFetch } from '../../../../redux/features/user'

const API = `${BASE_API_URL}user/change-password`

function* postEditUser(action) {
    //const userData = getUserData();
    const apiArgs = {
        API_CALL: {
            method: 'POST',
            url: API,
            data: action.payload,
            headers: {
                Authorization: '', //`Bearer ${userData.accessToken}`,
            },
        },
        successSlice: editSliceSuccess,
        failSlice: editSliceFail,
    }
    yield call(apiCall, apiArgs)
    yield put(getUserSliceFetch(action.payload._id))
}

export function* editUserSaga() {
    yield takeEvery(editSliceFetch.toString(), postEditUser)
}
