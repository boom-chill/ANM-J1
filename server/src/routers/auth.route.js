import express from 'express'
import {
    postRefreshToken,
    postLogin,
    postRegister,
} from '../controllers/auth.controller.js'

const router = express.Router()

//localhost:5000/api/auth/refresh-token
router.post('/refresh-token', postRefreshToken)

//localhost:5000/api/auth/login
router.post('/login', postLogin)

//localhost:5000/api/auth/login
router.post('/register', postRegister)

export default router
