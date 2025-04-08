import React from 'react';
import InputText from '../InputText';
import { useSelector, useDispatch } from 'react-redux';
import { setBasePrice, setCurrency } from '../../slices/productSlice';

const BasePrice = () => {
    const {basePrice, currency} =useSelector((state)=>state.products)
    const dispatch = useDispatch()

    const handlePriceChange = (e) => {
        dispatch(setBasePrice(e.target.value))
    };

    const handleCurrencyChange = (e) => {
        dispatch(setCurrency(e.target.value))
    };

    return (
        <div className="bg-white mb-4 dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
            <div className=" p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-medium dark:text-gray-200">Base Price</h3>
            </div>
            <div className="flex items-end gap-4 p-4">
                <div className="flex-grow">
                <InputText id="productBasePrice" type="number" title="Base Price" placeholder='e.g 10000' value={basePrice} onChange={handlePriceChange} />
                </div>

                <div className="flex-shrink-0 w-32">
                    <label htmlFor="currency" className="block font-medium text-sm text-gray-900 dark:text-gray-300">
                        Currency
                    </label>
                    <select
                        id="currency"
                        value={currency}
                        onChange={handleCurrencyChange}
                        className="mt-1 inputStyled"
                        required
                    >
                        <option value="USD">USD</option>
                        <option value="PKR">PKR</option>
                        <option value="EUR">EUR</option>
                        <option value="INR">INR</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default BasePrice;
