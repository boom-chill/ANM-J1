import express from 'express'
import { postSearch } from "../controllers/search.controller.js";

const router = express.Router()

router.post('/', postSearch)

export default router