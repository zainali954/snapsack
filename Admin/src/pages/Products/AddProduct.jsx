import React, { useEffect, useState } from 'react'
import BrandList from '../../components/Products/BrandList'
import PriceDependentAttributes from '../../components/Products/PriceDependentAttributes';
import ShippingDetails from '../../components/ShippingDetails';
import VisualAttributes from '../../components/Products/VisualAttributes';
import BasePrice from '../../components/Products/BasePrice';
import OtherAttributes from '../../components/Products/OtherAttributes';
import TagsComponent from '../../components/Products/TagsComponent';
import CategorySelector from '../../components/Products/CategorySelector';
import ImageUploader from '../../components/Products/ImageUploader';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, resetMessage, resetProduct } from '../../slices/productSlice';
import { resetPriceDependentAttributes } from '../../slices/PriceDependentSlice';
import { resetVisualAttributes } from '../../slices/visualAttributesSlice';
import UsePreventReload from '../../components/UsePreventReload';
import { resetOtherAttributes } from '../../slices/otherAttributesSlice';
import NameAndDescription from '../../components/Products/NameAndDescription';
import ManufacturerDetails from '../../components/Products/ManufacturerDetails';
const AddProduct = () => {
    const { name, description, basePrice, currency,
        category,subcategory, subsubcategory, shippingDetails, tags, manufacturerName,
        manufacturerContact, brand, formDirty } = useSelector((state) => state.products);

    const { priceDependentAttributes } = useSelector((state) => state.priceDependentAttributes);
    const { visualAttributes } = useSelector(state => state.visualAttributes);
    const { otherAttributes } = useSelector((state) => state.otherAttributes)

    const [selectedCategory, setSelectedCategory] = useState("");
        const [localImages, setLocalImages] = useState([])

    const dispatch = useDispatch()

    const onImageChange = (newImages) => {
        setLocalImages(newImages); // Update the images state when the images are added or removed
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
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
        localImages.forEach((image, index) => {
            formData.append('images', image);
        });

        await dispatch(addProduct(formData))
            .unwrap()
            .then(() => {
                dispatch(resetProduct()); // Form reset sirf API success hone pe
                dispatch(resetPriceDependentAttributes()); // Form reset sirf API success hone pe
                dispatch(resetVisualAttributes()); // Form reset sirf API success hone pe
                dispatch(resetOtherAttributes());
                setLocalImages([])
            })
            .catch((error) => {
                console.error("Product add failed:", error);
            });

    };

    UsePreventReload(formDirty)

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between bg-white mb-4 dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700 p-4">
                    <h3 className="text-xl font-medium dark:text-gray-200">Add Product</h3>
                    <button
                        type="submit"
                        className="buttonStyled"
                    >
                        Submit
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[60%_40%]">
                    <div className='md:mr-4'>
                        <NameAndDescription />
                        <BasePrice />
                        <PriceDependentAttributes />
                        <VisualAttributes />
                        {/* Images */}
                        <div className="bg-white my-4 dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
                            <div className=" p-4 border-b border-gray-200 dark:border-zinc-700">
                                <h3 className="text-lg font-medium dark:text-gray-200">Product Images</h3>
                            </div>
                            <div className="">
                                <ImageUploader
                                    images={localImages}
                                    setImages={setLocalImages}
                                    onImageChange={onImageChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <CategorySelector
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                        <BrandList category={selectedCategory} />
                        <OtherAttributes />
                        <TagsComponent />
                        <ShippingDetails />
                        <ManufacturerDetails />
                    </div>

                    {/* <Discount/> */}

                </div>

            </form>
        </div>
    )
}

export default AddProduct