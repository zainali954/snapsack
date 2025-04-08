import React from 'react'
import {setManufacturerContact, setManufacturerName } from '../../slices/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import InputText from '../InputText'

const ManufacturerDetails = () => {
    const {manufacturerContact, manufacturerName} = useSelector((state)=>state.products)
    const dispatch = useDispatch()
    return (
        <div className="bg-white my-4 dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
                            <div className=" p-4 border-b border-gray-200 dark:border-zinc-700">
                                <h3 className="text-lg font-medium dark:text-gray-200">Manufacturer</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                <InputText id="manufacturerName" title="Name" placeholder='Brand XYZ' value={manufacturerName} onChange={(e) => dispatch(setManufacturerName(e.target.value))} />
                                <div className="my-4">
                                    <label htmlFor="manufacturerContact" className="block font-medium text-sm text-gray-900 dark:text-gray-300">Contact</label>
                                    <textarea
                                        id="manufacturerContact"
                                        rows={3}
                                        type="text"
                                        placeholder='Contact info...'
                                        value={manufacturerContact}
                                        onChange={(e) => dispatch(setManufacturerContact(e.target.value))}
                                        className="mt-1 block w-full px-4 py-2 dark:text-gray-200 text-sm border bg-gray-50  border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-red-50"
                                    />
                                </div>

                            </div>
                        </div>
    )
}

export default ManufacturerDetails
