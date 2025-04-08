// src/components/VisualAttributes.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Cancel01Icon } from 'hugeicons-react';
import { addVisualAttribute, removeVisualAttribute, updateVisualAttribute, uploadImage, removeImage, resetState } from '../../slices/visualAttributesSlice';
import { toast } from 'react-toastify';

const VisualAttributes = () => {
    const dispatch = useDispatch();
    const { visualAttributes, isLoading } = useSelector(state => state.visualAttributes);

    const addNewAttribute = () => {
        dispatch(addVisualAttribute());
    };

    const removeExistingAttribute = (index) => {
        dispatch(removeVisualAttribute(index));
    };

    const handleChange = (index, field, value) => {
        dispatch(updateVisualAttribute({ index, field, value }));
    };

    const onImageUpload = async (index, file) => {
        dispatch(uploadImage({ index, file }));
    };

    const onRemoveImage = async (index) => {
        const confirmRemove = window.confirm("Are you sure you want to remove this image?");
        if (!confirmRemove) return;
        const imageUrl = visualAttributes[index].imageUrl;
        dispatch(removeImage({ imageUrl, index }));
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <div className=" p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-medium dark:text-gray-200">Visual Attributes</h3>
            </div>

            <div className="p-4">
                {visualAttributes.map((data, index) => (
                    <div key={index} className="flex items-start gap-4 mb-4 border border-gray-200 dark:border-zinc-700 p-2">
                        <div className="flex-grow">
                            <div className="mb-4">
                                <label htmlFor={`visualAttributeName-${index}`} className="block font-medium text-sm text-gray-900 dark:text-gray-300">
                                    Name
                                </label>
                                <input
                                    id={`visualAttributeName-${index}`}
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 text-sm dark:text-gray-200 text border bg-gray-50  border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-red-50"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor={`visualAttributeValue-${index}`} className="block font-medium text-sm text-gray-900 dark:text-gray-300">
                                    Value
                                </label>
                                <input
                                    id={`visualAttributeValue-${index}`}
                                    type="text"
                                    value={data.value}
                                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 text-sm dark:text-gray-200 text border bg-gray-50  border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-red-50"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor={`visualAttributeImage-${index}`} className="block font-medium text-sm text-gray-900 dark:text-gray-300">
                                    Associated Image
                                </label>
                                <input
                                    id={`visualAttributeImage-${index}`}
                                    type="file"
                                    onChange={(e) => onImageUpload(index, e.target.files[0])}
                                    className="block mt-1 cursor-pointer w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4 file:rounded-lg 
      file:border file:border-orange-400 dark:file:border-orange-600
      file:bg-orange-500 dark:file:bg-orange-700 file:text-white
      hover:file:bg-orange-600 dark:hover:file:bg-orange-800
      transition-all duration-200 ease-in-out"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col items-center">
                            {data.imageUrl ? (
                                <div className="flex flex-col items-center">
                                    <div className="group w-36 h-44 relative mb-1">
                                        <img
                                            src={data.imageUrl}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover rounded border border-gray-300 dark:border-zinc-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => onRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        >
                                            <Cancel01Icon size={16} />
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-36 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300 text-sm p-1 rounded resize-none overflow-x-auto whitespace-nowrap"
                                        rows="1"
                                        value={data.imageUrl}
                                        readOnly
                                    />
                                    <button
                                        type="button"
                                        className="text-blue-500 text-xs mt-1 underline"
                                        onClick={() => {
                                            navigator.clipboard.writeText(data.imageUrl);
                                            toast.success('Image URL copied to clipboard!');
                                          }}
                                          
                                    >
                                        Copy URL
                                    </button>
                                </div>
                            ) : ( 
                                <div className="w-36 h-44 border border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center text-gray-400">
                                    {isLoading ? "Uploading" : "No Image"}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => removeExistingAttribute(index)}
                            className="cancelBtn"
                        >
                            <Cancel01Icon size={16} />
                        </button>
                    </div>
                ))}

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={addNewAttribute}
                        className="buttonStyled"
                    >
                        + Add Attribute
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisualAttributes;
