import React, { useEffect, useState } from "react";
import ScrollAnimation from "./ScrollRevealAnimation";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// const offers = [
//     {
//         category: "Laptops",
//         tagline: [
//             { text: "Play", color: "text-white" },
//             { text: "Beyond", color: "text-white" },
//             { text: "Limits", color: "text-white" },
//         ],
//         title: "Laptops",
//         titleColor: "text-red-500",
//         color: { from: "red-700", to: "red-600", border: "red-900" },
//         image: "https://res.cloudinary.com/dyt6y8t5r/image/upload/v1739627388/product/mqvmk0mdyzdd6zcrldih.webp",
//         link: "/category/laptops",
//         colSpan: "col-span-1 row-span-2",
//         textAlign: "text-center",
//         flexDirection: "flex-col items-center justify-center",
//     },
//     {
//         category: "Cameras",
//         tagline: [
//             { text: "Capture", color: "text-zinc-900" },
//             { text: "Every", color: "text-zinc-800" },
//             { text: "Moment", color: "text-zinc-700" },
//         ],
//         title: "Cameras",
//         titleColor: "text-zinc-300",
//         color: { from: "zinc-50", to: "zinc-100", border: "gray-200" },
//         image: "https://res.cloudinary.com/dyt6y8t5r/image/upload/v1739627287/product/zy9wk4hvumcmm2lgdtuq.webp",
//         link: "/category/cameras",
//         colSpan: "col-span-1 sm:col-span-2 lg:col-span-2",
//         textAlign: "text-right pr-8",
//         flexDirection: "relative overflow-hidden",
//         imageStyle: "absolute bottom-0 left-0 h-56 sm:h-72 w-auto object-contain",
//     },
//     {
//         category: "Earphones",
//         tagline: [
//             { text: "Enjoy", color: "text-zinc-300" },
//             { text: "Every", color: "text-zinc-400" },
//             { text: "Beat", color: "text-zinc-500" },
//         ],
//         title: "Earphones",
//         titleColor: "text-zinc-600",
//         color: { from: "zinc-700", to: "zinc-900", border: "zinc-700" },
//         image: "https://res.cloudinary.com/dyt6y8t5r/image/upload/v1739627528/product/xhywekzdaimyrok5jwhr.webp",
//         link: "/category/earphones",
//         colSpan: "col-span-1 sm:col-span-2 lg:col-span-2",
//         textAlign: "text-left pl-10",
//         flexDirection: "relative",
//         imageStyle: "absolute top-0 right-0 h-52 sm:h-64 object-contain",
//     },
//     {
//         category: "Sneakers",
//         tagline: [
//             { text: "Run", color: "text-white" },
//             { text: "With", color: "text-white" },
//             { text: "Confidence", color: "text-white" },
//         ],
//         title: "Sneakers",
//         titleColor: "text-[#449094]",
//         color: { from: "#295d5f", to: "#449094", border: "zinc-300" },
//         image: "https://res.cloudinary.com/dyt6y8t5r/image/upload/v1739627037/product/tozcwsbovrjg0oarwk1v.webp",
//         link: "/category/sneakers",
//         colSpan: "col-span-1 row-span-2",
//         textAlign: "text-center",
//         flexDirection: "flex-col items-center justify-center",
//     },
// ];

const HomeOffers = () => {
const { offers } = useSelector( state => state.products)
    return (
        <ScrollAnimation>
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 grid-flow-dense">
                {offers?.map((offer, index) => (
                    <div
                        key={index}
                        className={`${offer.colSpan} bg-gradient-to-b from-${offer.color.from} to-${offer.color.to} p-6 rounded-3xl border border-${offer.color.border} ${offer.flexDirection}`}
                        style={
                            offer.category === "Sneakers"
                                ? { background: "linear-gradient(to bottom, #295d5f, #449094)" }
                                : {}
                        }
                    >
                        <div className={offer.textAlign}>
                            {offer.tagline.map((tag, i) => (
                                <p key={i} className={`text-xl md:text-2xl font-bold ${tag.color}`}>
                                    {tag.text}
                                </p>
                            ))}
                            <h3 className={`text-4xl md:text-5xl font-extrabold ${offer.titleColor} mt-3`}>
                                {offer.title}
                            </h3>
                        </div>
                        <img src={offer.image} alt={offer.category} className={offer.imageStyle} />
                        <div className={`mt-4 ${offer.textAlign}`}>
                            <Link to={offer.link} className="bg-zinc-700 rounded-full px-4 py-2 text-white hover:bg-red-600">
                                Explore 
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollAnimation>
    );
};

export default HomeOffers;
