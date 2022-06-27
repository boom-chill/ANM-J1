import React from 'react'
import { Navigate } from 'react-router-dom'
import { getLocalStorage } from './../../utils/localStorage'

function ProtectedRoute({ redirectPath = '/login', children }) {
    const user = getLocalStorage('user')
    if (!user) {
        return <Navigate to={redirectPath} replace />
    }

    return children
}

export default ProtectedRoute
