import React, { useState } from 'react';

const Discount = () => {
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [finalAmount, setFinalAmount] = useState('');

  const handleDiscountChange = () => {
    let discountedAmount;

    if (discountType === 'percentage') {
      discountedAmount = amount - (amount * (discount / 100));
    } else if (discountType === 'fixed') {
      discountedAmount = amount - discount;
    }

    setFinalAmount(discountedAmount.toFixed(2));
  };

  return (
    <div className="bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold dark:text-gray-200 mb-4">Discount Calculator</h3>
      <div className="mb-4">
        <label htmlFor="amount" className="block font-medium text-sm text-gray-900 dark:text-gray-300">Amount</label>
        <input
          id="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full px-4 py-2 text-sm border border-gray-200 bg-gray-100 rounded-sm dark:bg-zinc-800 dark:border-zinc-700"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="discountType" className="block font-medium text-sm text-gray-900 dark:text-gray-300">Discount Type</label>
        <select
          id="discountType"
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          className="mt-1 block w-full px-4 py-2 text-sm border border-gray-200 bg-gray-100 rounded-sm dark:bg-zinc-800 dark:border-zinc-700"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="discount" className="block font-medium text-sm text-gray-900 dark:text-gray-300">Discount</label>
        <input
          id="discount"
          type="number"
          placeholder="Enter discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="mt-1 block w-full px-4 py-2 text-sm border border-gray-200 bg-gray-100 rounded-sm dark:bg-zinc-800 dark:border-zinc-700"
        />
      </div>
      <button
        onClick={handleDiscountChange}
        className="mt-1 block w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-sm"
      >
        Apply Discount
      </button>
      {finalAmount && (
        <div className="mt-4">
          <p className="text-sm text-gray-900 dark:text-gray-300">
            Final Amount: {finalAmount}
          </p>
        </div>
      )}
    </div>
  );
};

export default Discount;
