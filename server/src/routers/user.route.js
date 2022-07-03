import express from 'express'
import {
    patchUser,
    getUser,
    changePassword,
} from '../controllers/user.controller.js'

const router = express.Router()

//localhost:5000/api/user
router.post('/edit', patchUser)

//localhost:5000/api/user
router.get('/:email', getUser)

//localhost:5000/api/user
router.post('/change-password', changePassword)

export default router
