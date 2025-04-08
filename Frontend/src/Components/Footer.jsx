import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='bg-gray-100 py-6'>
            {/* Top Section */}
            <div className='container mx-auto px-6 md:px-12 py-4 border-b border-gray-200 flex flex-wrap items-center justify-center md:justify-between gap-4'>
                {['Everyday fresh products', 'Free delivery for orders over $70', 'Daily Mega Discounts', 'Best price on the market'].map((text, index) => (
                    <div key={index} className=' px-4 md:px-6 py-2 text-center md:text-left'>
                        
                        <p className="text-sm text-gray-700">{text}</p>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="container mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-12 text-center md:text-left">
                <div>
                    <h5 className="uppercase text-lg font-medium text-gray-800 mb-2">Shop</h5>
                    {['SmartPhones & Laptops', 'Dairy Products', 'Kitchen Aplliances', 'Bed & Sofas'].map((item, index) => (
                        <Link key={index} className='block text-sm text-gray-600 hover:text-orange-500'>{item}</Link>
                    ))}
                </div>
                <div>
                    <h5 className="uppercase text-lg font-medium text-gray-800 mb-2">Support</h5>
                    {['Contact Us', 'FAQs', 'Shipping & Returns'].map((item, index) => (
                        <Link key={index} className='block text-sm text-gray-600 hover:text-orange-500'>{item}</Link>
                    ))}
                </div>
                <div>
                    <h5 className="uppercase text-lg font-medium text-gray-800 mb-2">Company</h5>
                    {['About Us', 'Careers', 'Privacy Policy'].map((item, index) => (
                        <Link key={index} className='block text-sm text-gray-600 hover:text-orange-500'>{item}</Link>
                    ))}
                </div>
                <div>
                    <h5 className="uppercase text-lg font-medium text-gray-800 mb-2">Follow Us</h5>
                    {['Facebook', 'Instagram', 'Twitter'].map((item, index) => (
                        <Link key={index} className='block text-sm text-gray-600 hover:text-orange-500'>{item}</Link>
                    ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="text-center text-gray-600 text-sm mt-6">
                © 2025 Snapsack. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
