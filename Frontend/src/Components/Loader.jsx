import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
