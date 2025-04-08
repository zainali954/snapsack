import express from 'express'
import OffersModel from '../models/offer.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const router = express.Router();

// Initial Offers Data
const initialOffers = [
    {
        category: "Laptops",
        tagline: [
            { text: "Play", color: "text-white" },
            { text: "Beyond", color: "text-white" },
            { text: "Limits", color: "text-white" },
        ],
        title: "Laptops",
        titleColor: "text-red-500",
        color: { from: "red-700", to: "red-600", border: "red-900" },
        image: "https://res.cloudinary.com/dyt6y8t5r/image/upload/v1739627388/product/mqvmk0mdyzdd6zcrldih.webp",
        link: "/category/laptops",
        colSpan: "col-span-1 row-span-2",
        textAlign: "text-center",
        flexDirection: "flex-col items-center justify-center",
    },
    {
        category: "Cameras",
        tagline: [
            { text: "Capture", color: "text-zinc-900" },
            { text: "Every", color: "text-zinc-800" },
            { text: "Moment", color: "text-zinc-700" },
        ],
        title: "Cameras",
        titleColor: "text-zinc-300",
        color: { from: "zinc-50", to: "zinc-100", border: "gray-200" },
        image: "https://res.cloudinary.com/dyt6y8t5r/image/upload/v1739627287/product/zy9wk4hvumcmm2lgdtuq.webp",
        link: "/category/cameras",
        colSpan: "col-span-1 sm:col-span-2 lg:col-span-2",
        textAlign: "text-right pr-8",
        flexDirection: "relative overflow-hidden",
        imageStyle: "absolute bottom-0 left-0 h-56 sm:h-72 w-auto object-contain",
    },
    {
        category: "Earphones",
        tagline: [
            { text: "Enjoy", color: "text-zinc-300" },
            { text: "Every", color: "text-zinc-400" },
            { text: "Beat", color: "text-zinc-500" },
        ],
        title: "Earphones",
        titleColor: "text-zinc-600",
        color: { from: "zinc-700", to: "zinc-900", border: "zinc-700" },
        image: "https://res.cloudinary.com/dyt6y8t5r/image/upload/v1739627528/product/xhywekzdaimyrok5jwhr.webp",
        link: "/category/earphones",
        colSpan: "col-span-1 sm:col-span-2 lg:col-span-2",
        textAlign: "text-left pl-10",
        flexDirection: "relative",
        imageStyle: "absolute top-0 right-0 h-52 sm:h-64 object-contain",
    },
    {
        category: "Sneakers",
        tagline: [
            { text: "Run", color: "text-white" },
            { text: "With", color: "text-white" },
            { text: "Confidence", color: "text-white" },
        ],
        title: "Sneakers",
        titleColor: "text-[#449094]",
        color: { from: "#295d5f", to: "#449094", border: "zinc-300" },
        image: "https://res.cloudinary.com/dyt6y8t5r/image/upload/v1739627037/product/tozcwsbovrjg0oarwk1v.webp",
        link: "/category/sneakers",
        colSpan: "col-span-1 row-span-2",
        textAlign: "text-center",
        flexDirection: "flex-col items-center justify-center",
    },
];

// Route to insert initial data
router.post("/insert-offers", verifyAuth, verifyAdmin, async (req, res) => {
    try {
        // Delete existing offers
        await OffersModel.deleteMany();

        // Insert new offers
        await OffersModel.insertMany(initialOffers);

        res.status(201).json({ message: "Initial offers inserted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/offers',asyncHandler( async(req, res)=>{
    const offers = await OffersModel.find()
    apiResponse.success(res, "fetched", offers, 200)
}))

export default router;
