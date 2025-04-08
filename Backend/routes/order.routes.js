import express from 'express'
import { buyNowOrder, createOrder, deleteOrder, fetchOrders, getAllOrders_admin, getOrderStats, searchOrders, updateOrder } from '../controllers/order.controller.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
const router = express.Router()


router.get('/', verifyAuth, fetchOrders)
router.post('/', verifyAuth, createOrder)
router.post('/buy-now', verifyAuth, buyNowOrder)

// admin
router.get('/admin',verifyAuth, verifyAdmin, getAllOrders_admin)
router.get('/search',verifyAuth, verifyAdmin, searchOrders)
router.get('/stats',verifyAuth, verifyAdmin, getOrderStats)
router.put('/:id/admin',verifyAuth, verifyAdmin, updateOrder)
router.delete('/:id/admin',verifyAuth, verifyAdmin, deleteOrder)
export default router;