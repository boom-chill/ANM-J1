import { getLocalStorage } from './localStorage'
import jwt_decode from 'jwt-decode'

export const checkisExpired = () => {
    const accessToken = getLocalStorage('accessToken')

    const { exp } = jwt_decode(accessToken)

    if (Date.now() >= exp * 1000) {
        return false
    }

    return true
}
