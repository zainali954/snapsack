import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import NameAndDescription from '../../components/Products/NameAndDescription';
import ManufacturerDetails from '../../components/Products/ManufacturerDetails';
import PriceDependentAttributes from '../../components/Products/PriceDependentAttributes';
import VisualAttributes from '../../components/Products/VisualAttributes';
import OtherAttributes from '../../components/Products/OtherAttributes';
import BasePrice from '../../components/Products/BasePrice';
import TagsComponent from '../../components/Products/TagsComponent';
import CategorySelector from '../../components/Products/CategorySelector';
import ImageUploader from '../../components/Products/ImageUploader';
import ShippingDetails from '../../components/ShippingDetails';
import BrandList from '../../components/Products/BrandList';
import { deleteProductImage, editProduct, resetMessage, resetProduct, setImages, setProductToEdit } from '../../slices/productSlice';
import { Cancel01Icon } from 'hugeicons-react';
import { resetPriceDependentAttributes } from '../../slices/PriceDependentSlice';
import { resetVisualAttributes } from '../../slices/visualAttributesSlice';
import { resetOtherAttributes } from '../../slices/otherAttributesSlice';
import UsePreventReload from '../../components/UsePreventReload';

const EditProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const {  name, description, basePrice, currency,
        category, shippingDetails, tags, manufacturerName, subcategory, subsubcategory,
        manufacturerContact, brand, formDirty, images, productToEdit } = useSelector((state) => state.products);

    const { priceDependentAttributes } = useSelector((state) => state.priceDependentAttributes);
    const { visualAttributes } = useSelector(state => state.visualAttributes);
    const { otherAttributes } = useSelector((state) => state.otherAttributes);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [localImages, setLocalImages] = useState([])

    useEffect(() => {
        if (!productToEdit) navigate('/dashboard/products'); // Redirect if no product to edit
    }, [productToEdit, navigate, id]);

    const onImageChange = (newImages) => {
        setLocalImages(newImages);
    };

    const handleImageDelete = (imageUrl) => {
        dispatch(deleteProductImage({ productId: id, imageUrl }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('subsubcategory', subsubcategory);
        formData.append('brand', brand);
        formData.append('basePrice', basePrice);
        formData.append('currency', currency);
        formData.append('tags', JSON.stringify(tags));
        formData.append('priceDependentAttributes', JSON.stringify(priceDependentAttributes));
        formData.append('visualAttributes', JSON.stringify(visualAttributes));
        formData.append('otherAttributes', JSON.stringify(otherAttributes));
        formData.append('shippingDetails', JSON.stringify(shippingDetails));
        formData.append('manufacturerName', manufacturerName);
        formData.append('manufacturerContact', manufacturerContact);

        formData.append('images', JSON.stringify(images));
        localImages.forEach((image) => {
            formData.append('images', image);
        });


        try {
            const response = await dispatch(editProduct({ id, formData })).unwrap();
            if (response.success) {
                dispatch(resetProduct());
                dispatch(resetPriceDependentAttributes());
                dispatch(resetVisualAttributes());
                dispatch(resetOtherAttributes());
                dispatch(setImages([]));
                dispatch(setProductToEdit(false));
            }
        } catch (error) {
            console.error("Product update failed:", error);
        }
    };

    UsePreventReload(formDirty)

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4">
                    <h3 className="text-xl font-medium dark:text-gray-200">Edit Product</h3>
                    <button type="submit" className="buttonStyled">Save Changes</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[60%_40%]">
                    <div className='md:mr-4'>
                        <NameAndDescription />
                        <BasePrice />
                        <PriceDependentAttributes />
                        <VisualAttributes />
                        <div className="bg-white mt-4 p-4 border border-gray-200 grid grid-cols-4 gap-2">
                            {images && images.map((image, index) => (
                                <div key={index} className="relative group h-32 bg-red-400 rounded-md overflow-hidden">
                                    <img src={image} alt="" className="object-cover h-full w-full" />
                                    <button
                                        type='button'
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleImageDelete(image)}
                                    >
                                        <Cancel01Icon />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white my-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
                            <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
                                <h3 className="text-lg font-medium dark:text-gray-200">Product Images</h3>
                            </div>
                            <ImageUploader images={localImages} setImages={setLocalImages} onImageChange={onImageChange} />
                        </div>
                    </div>
                    <div>
                        <CategorySelector selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        <BrandList category={selectedCategory?._id || selectedCategory} />
                        <OtherAttributes />
                        <TagsComponent />
                        <ShippingDetails />
                        <ManufacturerDetails />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
