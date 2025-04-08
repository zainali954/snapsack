import React, { useState } from 'react'
import Logo from '../assets/logo2.svg'
import Navigation from './Navigation'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BiUser, BiCart, BiLogOut, BiHeart, BiHistory } from "react-icons/bi";
import { logoutUser } from '../slices/authSlice'
import {motion} from 'motion/react'

const Header = () => {
  const { user } = useSelector(state => state.auth)
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch()

  const onLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div className='headerWraper container mx-auto'>


      <header className="flex items-center justify-between gap-4 mt-6 p-2">
        <Link to="/" className="">
          <img src={Logo} alt="Logo" className='h-12' />
        </Link>
        <div className=" hidden
        lg:flex gap-4 items-center">
          <ul className="flex justify-center space-x-4">
            <li className="py-2 px-4 rounded-full bg-orange-100 text-orange-600 font-medium"><a href="#home">Home</a></li>
            <li className=" py-2 px-4 rounded-full bg-white hover:bg-orange-100 text-zinc-800 hover:text-orange-600 font-medium"><a href="#categories">Categories</a></li>
            <li className=" py-2 px-4 rounded-full bg-white hover:bg-orange-100 text-zinc-800 hover:text-orange-600 font-medium"><a href="#deals">Deals</a></li>
            <li className=" py-2 px-4 rounded-full bg-white hover:bg-orange-100 text-zinc-800 hover:text-orange-600 font-medium"><a href="#contact">Contact</a></li>
            <li className=" py-2 px-4 rounded-full bg-white hover:bg-orange-100 text-zinc-800 hover:text-orange-600 font-medium"><a href="#about">About</a></li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 relative">
          {user ? (
            <div className="relative">
              <motion.div
              whileTap={{
                scale:1.2
              }}
                className="rounded-full w-12 h-12 grid place-items-center border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <BiUser size={20} />
              </motion.div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                  <p className="px-4 py-2 text-sm text-gray-700 border-b">{user.name}</p>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BiUser size={18} /> Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)} 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BiHistory size={18} /> Orders
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false)
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <BiLogOut size={18} /> Logout
                  </button>
                </div>
              )}

            </div>
          ) : (
            <Link to="/login" className="rounded-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white">
              Login
            </Link>
          )}
          <Link to="/wishlist" className="relative rounded-full p-3 grid place-items-center bg-red-100 text-red-500">
            <BiHeart size={18} />

            {wishlist.length > 0 && <span className="absolute -top-1 -right-1 grid place-items-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">{wishlist?.length || null}</span>}
          </Link>
          <Link to="/cart" className="relative rounded-full p-3 grid place-items-center bg-orange-100 text-orange-500">
            <BiCart size={18} />

            {cartItems.length > 0 && <span className="absolute -top-1 -right-1 grid place-items-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs">{cartItems?.length || null}</span>}
          </Link>
        </div>
      </header>

      <Navigation />

    </div>
  )
}

export default Header
