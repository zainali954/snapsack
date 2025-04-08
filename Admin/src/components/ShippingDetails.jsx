import React from "react";
import { Checkbox } from '@headlessui/react'
import { Radio, RadioGroup } from '@headlessui/react'
import { useDispatch, useSelector } from "react-redux";
import { setShippingDetails } from "../slices/productSlice";

const ShippingDetails = () => {
    const { shippingDetails, countries } = useSelector((state) => state.products)

    const dispatch = useDispatch()

    const handleChange = (field, value) => {
        dispatch(setShippingDetails({ [field]: value }));
    };

    const handleMultiSelect = (value) => {
        dispatch(setShippingDetails({
            available_in: shippingDetails.available_in.includes(value)
                ? shippingDetails.available_in.filter((country) => country !== value)
                : [...shippingDetails.available_in, value]
        }));
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <div className=" p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-medium dark:text-gray-200">Other Attributes</h3>
            </div>
            <div className="p-4">
                {/* Weight, Dimensions, and Shipping Option */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                            Weight
                        </label>
                        <div className="flex gap-2  items-center">
                            <input
                                type="number"
                                name="Weight"
                                placeholder="Weight"
                                value={shippingDetails.weight}
                                onChange={(e) => handleChange("weight", e.target.value)}
                                className="w-full px-4 py-2 text-sm border bg-gray-50  border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-red-50"
                            />

                            <select
                                value={shippingDetails.weightUnit}
                                onChange={(e) => handleChange("weigthUnit", e.target.value)}
                                className="inputStyled"
                            >
                                <option value="cm">kg</option>
                                <option value="in">lb</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                            Height
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="Height"
                                placeholder="Height"
                                value={shippingDetails.height}
                                onChange={(e) => handleChange("height", e.target.value)}
                                className="w-full px-4 py-2 text-sm border bg-gray-50  border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-red-50"
                            />
                            <select
                                value={shippingDetails.heightUnit}
                                onChange={(e) => handleChange("heightUnit", e.target.value)}
                                className="inputStyled"
                            >
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                            Length
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="Length"
                                placeholder="Length"
                                value={shippingDetails.length}
                                onChange={(e) => handleChange("length", e.target.value)}
                                className="w-full px-4 py-2 text-sm border bg-gray-50  border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-red-50"
                            />
                            <select
                                value={shippingDetails.lengthUnit}
                                onChange={(e) => handleChange("lengthUnit", e.target.value)}
                                className="inputStyled"
                            >
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                            Width
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="Width"
                                placeholder="Width"
                                value={shippingDetails.width}
                                onChange={(e) => handleChange("width", e.target.value)}
                                className="inputStyled"
                            />
                            <select
                                value={shippingDetails.widthUnit}
                                onChange={(e) => handleChange("widthUnit", e.target.value)}
                                className="inputStyled"
                            >
                                <option value="kg">cm</option>
                                <option value="lb">in</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Shipping Option */}

                <div className="mb-4">
                    <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                        Shipping Option
                    </label>
                    <RadioGroup value={shippingDetails.option} onChange={(value) => handleChange("option", value)}>
                        <div className="flex gap-4">
                            <Radio value="Standard">
                                {({ checked }) => (
                                    <label className={`flex items-center gap-2 p-2 rounded-full cursor-pointer ${checked ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300'}`}>
                                        <span className={`w-4 h-4 rounded-full ${checked ? 'bg-orange-200' : 'bg-white dark:bg-zinc-700'}`} />
                                        <span>Standard</span>
                                    </label>
                                )}
                            </Radio>
                            <Radio value="Express">
                                {({ checked }) => (
                                    <label className={`flex items-center gap-2 p-2 rounded-full cursor-pointer ${checked ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300'}`}>
                                        <span className={`w-4 h-4 rounded-full ${checked ? 'bg-orange-200' : 'bg-white dark:bg-zinc-700'}`} />
                                        <span>Express</span>
                                    </label>
                                )}
                            </Radio>
                        </div>
                    </RadioGroup>
                </div>

                {/* Available In (Multi-select) */}
                <div className="">
                    <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                        Available In
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {countries.map((country) => (
                            <label key={country} className="flex items-center gap-2">
                                <Checkbox
                                    value={country}
                                    checked={shippingDetails.available_in.includes(country)}
                                    onChange={() => handleMultiSelect(country)}
                                    className="group block size-4 rounded border bg-white data-[checked]:bg-orange-500"
                                >
                                    {/* Checkmark icon */}
                                    <svg className="stroke-white opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Checkbox>

                                <span className="text-gray-700 dark:text-gray-300">
                                    {country}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingDetails;