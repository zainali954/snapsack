import express from 'express'
import verifyAuth from '../middlewares/verifyAuth.js'
import { addToWishlist, fetchWishlist } from '../controllers/wishlist.controller.js'
const router = express.Router()

router.post('/', verifyAuth, addToWishlist)
router.get('/', verifyAuth, fetchWishlist)

export default router;