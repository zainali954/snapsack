import React from 'react';
import { Cancel01Icon } from 'hugeicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { addAttribute, removeAttribute, updateAttribute } from '../../slices/otherAttributesSlice';

const OtherAttributes = () => {
    const { otherAttributes } = useSelector((state) => state.otherAttributes)
    const dispatch = useDispatch()

    const handleAddAttribute = () => {
        dispatch(addAttribute())
    };

    const handleRemoveAttribute = (index) => {
        dispatch(removeAttribute(index))
    };

    const handleChange = (index, field, value) => {
        dispatch(updateAttribute({ index, field, value }));
    };
    return (
        <div className="bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <div className=" p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-medium dark:text-gray-200">Other Attributes</h3>
            </div>
            <div className="p-4">
                {otherAttributes.map((data, index) => (
                    <div key={index} className="flex items-start gap-4 mb-4 border border-gray-200 dark:border-zinc-700 p-2 ">
                        <div className="flex-grow">
                            <div className="mb-4">
                                <label htmlFor={`OtherAttributeName-${index}`} className="block font-medium text-sm text-gray-900 dark:text-gray-300">Name</label>
                                <input
                                    id={`OtherAttributeName-${index}`}
                                    type="text"
                                    name="Attribute Name"
                                    placeholder="e.g. Length"
                                    value={data.name}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    className="mt-1 inputStyled"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor={`OtherAttributeValue-${index}`} className="block font-medium text-sm text-gray-900 dark:text-gray-300">Value</label>
                                <input
                                    id={`OtherAttributeValue-${index}`}
                                    type="text"
                                    name="Attribute Value"
                                    placeholder="e.g. 100"
                                    value={data.value}
                                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                                    className="mt-1 inputStyled"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveAttribute(index)}
                            className="cancelBtn"
                        >
                            <Cancel01Icon size={16} />
                        </button>
                    </div>
                ))}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleAddAttribute}
                        className="buttonStyled"
                    >
                        Add Attribute
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtherAttributes;
