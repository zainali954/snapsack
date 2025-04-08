import React, { useState } from "react";
import { Range } from "react-range";

const PriceFilter = ({ min = 0, max = 1000, step = 50 }) => {
  const [values, setValues] = useState([min, max]);

  const handlePriceChange = (newValues) => {
    setValues(newValues);
  };

  return (
    <div className="w-full ">

      {/* Range Slider */}
      <div className="flex flex-col items-center">
        <Range
          values={values}
          step={step}
          min={min}
          max={max}
          onChange={handlePriceChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="w-full h-1 bg-gray-300 rounded-lg"
              style={{
                ...props.style,
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props, isDragged }) => (
            <div
              {...props}
              className={`h-5 w-5 bg-blue-500 rounded-full border-2 border-white ${
                isDragged ? "shadow-lg" : ""
              }`}
              style={{
                ...props.style,
              }}
            />
          )}
        />

        {/* Display Min and Max Price */}
        <div className="flex justify-between w-full mt-3 text-sm">
          <span className="text-gray-600">Min: Rs {values[0]}</span>
          <span className="text-gray-600">Max: Rs {values[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
