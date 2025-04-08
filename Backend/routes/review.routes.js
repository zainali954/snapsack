import express from 'express';
import { createReview, getProductReviews, editReview, deleteReview, getReviews, adminDeleteReview, reviewStats, searchReviews } from '../controllers/reviewController.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const userReviewRouter = express.Router();
const adminReviewRouter = express.Router();

// admin
adminReviewRouter.get('/', verifyAuth, verifyAdmin, getReviews)
adminReviewRouter.get('/stats', verifyAuth, verifyAdmin, reviewStats)
adminReviewRouter.get('/search', verifyAuth, verifyAdmin, searchReviews)
adminReviewRouter.delete('/:reviewId', verifyAuth, verifyAdmin, adminDeleteReview)

userReviewRouter.post('/', verifyAuth, createReview); // create review
userReviewRouter.get('/:id', getProductReviews); // fetch reviews of product
userReviewRouter.put('/:id',verifyAuth, editReview); // edit review with review id
userReviewRouter.delete('/:id',verifyAuth, deleteReview); // delete review with review id



export { userReviewRouter, adminReviewRouter } 