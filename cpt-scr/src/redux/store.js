import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import userReducer from '../redux/features/user'
import messageReducer from '../redux/features/message'
import createSagaMiddleware from 'redux-saga'
import registerReducer from '../pages/Register/features/register'
import editUserReducer from '../pages/User/Edit/features/edit'

import rootSaga from '../sagas/saga'

let sagaMiddleware = createSagaMiddleware()
const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware]
export const store = configureStore({
    reducer: {
        userState: userReducer,
        messageState: messageReducer,
        registerState: registerReducer,
        editUserState: editUserReducer,
    },
    middleware,
    serializableCheck: false,
})

sagaMiddleware.run(rootSaga)
