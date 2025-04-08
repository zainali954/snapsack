import express from 'express';
import { createBrand, deleteBrand, getAllBrands, getBrandsByCategoryId, updateBrand } from '../controllers/brand.controller.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
const router = express.Router();

router.get('/',  getAllBrands);

router.post('/',verifyAuth, verifyAdmin,  createBrand);  
router.get('/:categoryId',verifyAuth,  getBrandsByCategoryId);
router.put("/:id",verifyAuth, verifyAdmin, updateBrand)
router.delete("/:id",verifyAuth, verifyAdmin, deleteBrand)

export default router;