import express from 'express'
import { downloadFile } from './../controllers/file.controller.js'

const router = express.Router()

//localhost:5000/api/file/download
router.get('/download', downloadFile)

export default router
