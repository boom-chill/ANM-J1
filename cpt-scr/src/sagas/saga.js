import { all } from 'redux-saga/effects'
import { getUserSaga } from '../app/sagas/saga'
import { loginSaga } from '../pages/Login/sagas/saga'
import { registerSaga } from '../pages/Register/sagas/saga'

export default function* rootSaga() {
    yield all([loginSaga(), getUserSaga(), registerSaga()])
}
