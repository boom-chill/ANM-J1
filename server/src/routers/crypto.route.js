import express from 'express'
import { getPublicKey } from '../controllers/crypto.controller.js';

const router = express.Router()

//localhost:5000/api/encrypt/public-key
router.get('/public-key', getPublicKey)


export default router
