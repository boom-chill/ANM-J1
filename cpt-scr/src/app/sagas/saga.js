import { call, takeEvery } from 'redux-saga/effects'
import { getLocalStorage } from './../../utils/localStorage'
import {
    getUserSliceFail,
    getUserSliceFetch,
    getUserSliceSuccess,
} from '../../redux/features/user'
import { BASE_API_URL } from './../../api/index'
import apiCall from '../../sagas/api'

function* getUser(action) {
    const user = getLocalStorage('user')
    const API = `${BASE_API_URL}user/${user.email}`
    const apiArgs = {
        API_CALL: {
            method: 'GET',
            url: API,
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
            },
        },
        successSlice: getUserSliceSuccess,
        failSlice: getUserSliceFail,
    }
    yield call(apiCall, apiArgs)
}

export function* getUserSaga() {
    yield takeEvery(getUserSliceFetch.toString(), getUser)
}
