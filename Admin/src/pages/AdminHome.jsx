import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Routes, Route, useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddProduct from "./Products/AddProduct";
import EditProduct from "./Products/EditProduct";
import ProductList from "./Products/ProductList"; 
import SettingsPage from "./SettingsPage"; 
import BrandManagement from "./Brands/BrandList";
import CategoriesList from "./Categories/CategoriesList";
import Breadcrumb from "../components/Breedcrumb";
import OrdersList from "./Orders/OrderList";
import UsersList from "./Users/UsersList";
import Reviews from "./Reviews/reviews"
import DashboardHome from './Home'
import CartList from "./cart/cartList";

const AdminHome = () => {
  const navigate = useNavigate();
  const { expanded } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [isMenuHidden, setIsMenuHidden] = useState(true);

  // 🚀 Redirect if user is not logged in or not an admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const toggleMenu = () => {
    setIsMenuHidden((prevState) => !prevState);
  };

  return (
    <div className="flex max-w-screen bg-gray-100 min-h-screen dark:bg-zinc-800">
      {/* Sidebar */}
      <Sidebar toggleMenu={toggleMenu} isMenuHidden={isMenuHidden} />

      {/* Main Content */}
      <main className={`flex-grow overflow-hidden mb-4 bg-zinc-50 dark:bg-zinc-800 ${expanded ? "md:ml-64" : "md:ml-16"}`}>
        {/* Top navigation bar */}
        <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 p-4">
          <div className="flex justify-between items-center">
            {/* Logo or Title */}
            <div className="text-xl font-bold dark:text-gray-100">
              <Link to="/dashboard">Admin Panel</Link>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="ml-auto text-black dark:text-white md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6l16 0" />
                <path d="M4 12l16 0" />
                <path d="M4 18l16 0" />
              </svg>
            </button>
          </div>
        </nav>

        <div className="p-4 ">
          <Breadcrumb />
          <Routes>
            {/* Main dashboard route */}
            <Route path="/" element={<DashboardHome />} />

            {/* Dashboard Sub-Routes */}
            <Route path="/users" element={<UsersList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/add-product" element={<AddProduct />} />
            <Route path="/products/edit-product/:id" element={<EditProduct />} />
            <Route path="/brands" element={<BrandManagement />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/cart" element={<CartList />} />
          </Routes>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
