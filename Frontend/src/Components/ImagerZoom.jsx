import React, { useEffect, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";

const ImagerZoom = ({ images, visualImage, setVisualImage }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    const handleImageClick = (index) => {
        setSelectedImage(index);
        setVisualImage(null)
    };
    useEffect(() => {
        if (visualImage) {
            const index = images.findIndex((img) => img === visualImage);
            if (index !== -1) setSelectedImage(index);
        }
    }, [visualImage, images]);


    return (
        <div className="relative">
            <div className={`relative overflow-hidden w-full h-96 bg-gray-100 flex items-center justify-center`}>
                <div
                    key={selectedImage}
                    className="absolute rounded-xl overflow-hidden inset-0 transform transition-transform duration-500 flex items-center justify-center"
                >
                    <InnerImageZoom
                        src={visualImage ? visualImage : images[selectedImage]}
                        zoomSrc={visualImage ? visualImage : images[selectedImage]}
                        className="w-full h-full object-cover object-center aspect-square"
                        zoomScale={1}
                    />
                </div>
            </div>


            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4 ">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index}`}
                        className={`w-full h-20 cursor-pointer border-2 rounded-lg transition-all duration-300 ${selectedImage === index && !visualImage ? "border-orange-500 scale-105 shadow-lg" : "border-gray-200 hover:scale-105"
                            }`}
                        onClick={() => handleImageClick(index)}
                    />
                ))}
            </div>

        </div>
    );
};

export default ImagerZoom;
