import React from 'react';

const InputText = ({ id, type="text", title, placeholder, onChange, value, required = false }) => {
  return (
    <div>
      <label htmlFor={id || "defaultId"} className="block font-medium text-sm text-gray-900 dark:text-gray-300">
        {title}
      </label>
      <input
        id={id || "defaultId"}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 inputStyled"
        required={required}
        aria-label={title} // Accessibility improvement
      />
    </div>
  );
};

export default InputText;
