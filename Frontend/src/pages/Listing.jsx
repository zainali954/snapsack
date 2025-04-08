import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ProductItem from '../Components/ProductItem';
import Pagination from '../Components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchProducts } from '../slices/productSlice';

const Listing = () => {
    const [gridColumns, setGridColumns] = useState(4); 
    const {products} = useSelector(state=>state.products)
    const dispatch = useDispatch()
    const location = useLocation(); 
  
  useEffect(() => {
    dispatch(fetchProducts(location.search))
  }, [location.search]); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setGridColumns(1); 
      } else {
        setGridColumns(4); 
      }
    };
  
    handleResize(); // run on mount
    window.addEventListener('resize', handleResize);
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

    return (
        <div className="container mx-auto flex mt-6">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 px-6">
                {/* Header Section */}
                <div className="flex items-center justify-between bg-gray-100 py-3 px-4 rounded-md ">
                    {/* Left Actions */}
                    <div className="flex items-center gap-4 ">
                        <button onClick={() => setGridColumns(1)} className={`hover:text-gray-900 ${gridColumns === 1 ? "text-gray-900" : "text-gray-400"}`}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 0H2C0.895431 0 0 0.895431 0 2C0 3.10457 0.89543 4 2 4H20C21.1046 4 22 3.10457 22 2C22 0.895431 21.1046 0 20 0Z" fill="currentColor" />
                                <path d="M20 6H2C0.895431 6 0 6.89543 0 8C0 9.10457 0.89543 10 2 10H20C21.1046 10 22 9.10457 22 8C22 6.89543 21.1046 6 20 6Z" fill="currentColor" />
                                <path d="M20 12H2C0.895431 12 0 12.8954 0 14C0 15.1046 0.89543 16 2 16H20C21.1046 16 22 15.1046 22 14C22 12.8954 21.1046 12 20 12Z" fill="currentColor" />
                                <path d="M20 18H2C0.895431 18 0 18.8954 0 20C0 21.1046 0.89543 22 2 22H20C21.1046 22 22 21.1046 22 20C22 18.8954 21.1046 18 20 18Z" fill="currentColor" />
                            </svg>
                        </button>

                        <button onClick={() => setGridColumns(2)} className={`hover:text-gray-900 ${gridColumns === 2 ? "text-gray-900" : "text-gray-400"}`}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0H2C0.895431 0 0 0.895431 0 2C0 3.10457 0.89543 4 2 4H8C9.10457 4 10 3.10457 10 2C10 0.895431 9.10457 0 8 0Z" fill="currentColor" />
                                <path d="M20 0H14C12.8954 0 12 0.895431 12 2C12 3.10457 12.8954 4 14 4H20C21.1046 4 22 3.10457 22 2C22 0.895431 21.1046 0 20 0Z" fill="currentColor" />
                                <path d="M8 6H2C0.895431 6 0 6.89543 0 8C0 9.10457 0.89543 10 2 10H8C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6Z" fill="currentColor" />
                                <path d="M20 18H14C12.8954 18 12 18.8954 12 20C12 21.1046 12.8954 22 14 22H20C21.1046 22 22 21.1046 22 20C22 18.8954 21.1046 18 20 18Z" fill="currentColor" />
                                <path d="M8 18H2C0.895431 18 0 18.8954 0 20C0 21.1046 0.89543 22 2 22H8C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18Z" fill="currentColor" />
                                <path d="M8 12H2C0.895431 12 0 12.8954 0 14C0 15.1046 0.89543 16 2 16H8C9.10457 16 10 15.1046 10 14C10 12.8954 9.10457 12 8 12Z" fill="currentColor" />
                                <path d="M20 12H14C12.8954 12 12 12.8954 12 14C12 15.1046 12.8954 16 14 16H20C21.1046 16 22 15.1046 22 14C22 12.8954 21.1046 12 20 12Z" fill="currentColor" />
                                <path d="M20 6H14C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10H20C21.1046 10 22 9.10457 22 8C22 6.89543 21.1046 6 20 6Z" fill="currentColor" />
                            </svg>
                        </button>

                        <button onClick={() => setGridColumns(3)} className={`hover:text-gray-900 hidden md:block ${gridColumns === 3 ? "text-gray-900" : "text-gray-400"}`}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 0H18C16.8954 0 16 0.895431 16 2C16 3.10457 16.8954 4 18 4H20C21.1046 4 22 3.10457 22 2C22 0.895431 21.1046 0 20 0Z" fill="currentColor" />
                                <path d="M12 0H10C8.89543 0 8 0.895431 8 2C8 3.10457 8.89543 4 10 4H12C13.1046 4 14 3.10457 14 2C14 0.895431 13.1046 0 12 0Z" fill="currentColor" />
                                <path d="M4 0H2C0.895431 0 0 0.895431 0 2C0 3.10457 0.89543 4 2 4H4C5.10457 4 6 3.10457 6 2C6 0.895431 5.10457 0 4 0Z" fill="currentColor" />
                                <path d="M20 12H18C16.8954 12 16 12.8954 16 14C16 15.1046 16.8954 16 18 16H20C21.1046 16 22 15.1046 22 14C22 12.8954 21.1046 12 20 12Z" fill="currentColor" />
                                <path d="M20 6H18C16.8954 6 16 6.89543 16 8C16 9.10457 16.8954 10 18 10H20C21.1046 10 22 9.10457 22 8C22 6.89543 21.1046 6 20 6Z" fill="currentColor" />
                                <path d="M12 12H10C8.89543 12 8 12.8954 8 14C8 15.1046 8.89543 16 10 16H12C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12Z" fill="currentColor" />
                                <path d="M12 6H10C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10H12C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6Z" fill="currentColor" />
                                <path d="M4 6H2C0.895431 6 0 6.89543 0 8C0 9.10457 0.89543 10 2 10H4C5.10457 10 6 9.10457 6 8C6 6.89543 5.10457 6 4 6Z" fill="currentColor" />
                                <path d="M4 12H2C0.895431 12 0 12.8954 0 14C0 15.1046 0.89543 16 2 16H4C5.10457 16 6 15.1046 6 14C6 12.8954 5.10457 12 4 12Z" fill="currentColor" />
                                <path d="M20 18H18C16.8954 18 16 18.8954 16 20C16 21.1046 16.8954 22 18 22H20C21.1046 22 22 21.1046 22 20C22 18.8954 21.1046 18 20 18Z" fill="currentColor" />
                                <path d="M12 18H10C8.89543 18 8 18.8954 8 20C8 21.1046 8.89543 22 10 22H12C13.1046 22 14 21.1046 14 20C14 18.8954 13.1046 18 12 18Z" fill="currentColor" />
                                <path d="M4 18H2C0.895431 18 0 18.8954 0 20C0 21.1046 0.89543 22 2 22H4C5.10457 22 6 21.1046 6 20C6 18.8954 5.10457 18 4 18Z" fill="currentColor" />
                            </svg>
                        </button>

                        <button onClick={() => setGridColumns(4)} className={`hover:text-gray-900 hidden md:block ${gridColumns === 4 ? "text-gray-900" : "text-gray-400"}`}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 2C18 3.10457 18.8954 4 20 4C21.1046 4 22 3.10457 22 2C22 0.895431 21.1046 0 20 0C18.8954 0 18 0.895431 18 2Z" fill="currentColor" />
                                <path d="M0 2C0 3.10457 0.895431 4 2 4C3.10457 4 4 3.10457 4 2C4 0.895431 3.10457 0 2 0C0.895431 0 0 0.895431 0 2Z" fill="currentColor" />
                                <path d="M0 20C0 21.1046 0.895431 22 2 22C3.10457 22 4 21.1046 4 20C4 18.8954 3.10457 18 2 18C0.895431 18 0 18.8954 0 20Z" fill="currentColor" />
                                <path d="M18 20C18 21.1046 18.8954 22 20 22C21.1046 22 22 21.1046 22 20C22 18.8954 21.1046 18 20 18C18.8954 18 18 18.8954 18 20Z" fill="currentColor" />
                                <path d="M12 20C12 21.1046 12.8954 22 14 22C15.1046 22 16 21.1046 16 20C16 18.8954 15.1046 18 14 18C12.8954 18 12 18.8954 12 20Z" fill="currentColor" />
                                <path d="M6 20C6 21.1046 6.89543 22 8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20Z" fill="currentColor" />
                                <path d="M0 8C0 9.10457 0.895431 10 2 10C3.10457 10 4 9.10457 4 8C4 6.89543 3.10457 6 2 6C0.895431 6 0 6.89543 0 8Z" fill="currentColor" />
                                <path d="M18 14C18 15.1046 18.8954 16 20 16C21.1046 16 22 15.1046 22 14C22 12.8954 21.1046 12 20 12C18.8954 12 18 12.8954 18 14Z" fill="currentColor" />
                                <path d="M18 8C18 9.10457 18.8954 10 20 10C21.1046 10 22 9.10457 22 8C22 6.89543 21.1046 6 20 6C18.8954 6 18 6.89543 18 8Z" fill="currentColor" />
                                <path d="M0 14C0 15.1046 0.895431 16 2 16C3.10457 16 4 15.1046 4 14C4 12.8954 3.10457 12 2 12C0.895431 12 0 12.8954 0 14Z" fill="currentColor" />
                                <path d="M6 14C6 15.1046 6.89543 16 8 16C9.10457 16 10 15.1046 10 14C10 12.8954 9.10457 12 8 12C6.89543 12 6 12.8954 6 14Z" fill="currentColor" />
                                <path d="M12 2C12 3.10457 12.8954 4 14 4C15.1046 4 16 3.10457 16 2C16 0.895431 15.1046 0 14 0C12.8954 0 12 0.895431 12 2Z" fill="currentColor" />
                                <path d="M12 8C12 9.10457 12.8954 10 14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8Z" fill="currentColor" />
                                <path d="M12 14C12 15.1046 12.8954 16 14 16C15.1046 16 16 15.1046 16 14C16 12.8954 15.1046 12 14 12C12.8954 12 12 12.8954 12 14Z" fill="currentColor" />
                                <path d="M6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2C10 0.895431 9.10457 0 8 0C6.89543 0 6 0.895431 6 2Z" fill="currentColor" />
                                <path d="M6 8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Dropdown */}
                    <button
                        className="inline-flex items-center border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        10
                        <svg
                            className="ml-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <div className={`product-listing mt-4 border border-b-0 border-r-0 border-gray-200 grid ${gridColumns === 1 ? "grid-cols-1" : gridColumns === 2 ? "grid-cols-2" : gridColumns === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
                    {products.map((product) => (
                        <ProductItem key={product._id} singleView={gridColumns === 1} product={product} />
                    ))}
                </div>
                {/* <Pagination /> */}
            </div>
        </div>
    );
};

export default Listing;
