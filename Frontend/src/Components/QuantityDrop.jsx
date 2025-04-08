import React from 'react';
import { HiOutlineMinusSm, HiOutlinePlusSm } from "react-icons/hi";

const QuantityDrop = ({quantity, setQuantity}) => {

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only numeric input
      setQuantity(Number(value));
    }
  };

  const plus = () => setQuantity((prev) => prev + 1);
  const minus = () => setQuantity((prev) => Math.max(0, prev - 1)); // Prevent negative values

  return (
    <div className="div">
      <div className=" mt-6 w-fit rounded-full bg-gray-100">
      <div className="flex items-center gap-1 px-1 py-1">
        <button
          onClick={minus}
          className="w-10 h-10  rounded-full grid place-items-center bg-transparent hover:bg-white"
        >
          <HiOutlineMinusSm />
        </button>
        <input
          type="text"
          value={quantity}
          onChange={handleInputChange}
          className="w-12 text-center text-lg outline-none appearance-none"
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
          }}
        />
        <button
          onClick={plus}
          className="w-10 h-10 rounded-full grid place-items-center bg-transparent hover:bg-white"
        >
          <HiOutlinePlusSm />
        </button>
      </div>
    </div>
    </div>
  );
};

export default QuantityDrop;
