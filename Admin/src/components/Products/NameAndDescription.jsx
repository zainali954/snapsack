import React from 'react'
import { setDescription, setName } from '../../slices/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import InputText from '../InputText'

const NameAndDescription = () => {
    const {name, description} = useSelector((state)=>state.products)
    const dispatch = useDispatch()
    return (
        <div className="bg-white mb-4 dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
            <div className=" p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-medium dark:text-gray-200">Name and Description</h3>
            </div>
            <div className="p-4">

                <InputText id="productName" title="Title" placeholder='What is the name of Your product.' value={name} onChange={(e) => dispatch(setName(e.target.value))} />

                <div className="my-4">
                    <label htmlFor="productDescription" className="block font-medium text-sm text-gray-900 dark:text-gray-300">Description</label>
                    <textarea
                        id="productDescription"
                        rows={3}
                        type="text"
                        placeholder='Write the detailed description of the product.'
                        value={description}
                        onChange={(e) => dispatch(setDescription(e.target.value))}
                        className="mt-1 block w-full px-4 py-2 dark:text-gray-200 text-sm border bg-gray-50  border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-red-50"

                    />
                </div>
            </div>
        </div>
    )
}

export default NameAndDescription
