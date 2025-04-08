import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleSidebar } from "../slices/uiSlice";
import {
  Analytics01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  UserMultipleIcon,
  ProductLoadingIcon,
  HelpCircleIcon,
  Megaphone01Icon,
  Settings01Icon,
  ShoppingBag01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  LogoutSquare02Icon,
  StarSquareIcon,
  PackageIcon,
  Invoice03Icon,
  ChartAverageIcon
} from "hugeicons-react";

import logo from "../assets/logo2.svg";
import ThemeToggle from "./ThemeToggle";
import { logoutUser } from "../slices/authSlice";

export default function Sidebar({ isMenuHidden }) {
  const { expanded, theme } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [dropdowns, setDropdowns] = useState(""); // State to manage dropdowns

  const toggleDropdown = (item) => {
    setDropdowns((prev) => (prev === item ? "" : item));
  };

  const handleLogout = () => {
    alert("Do you want to logout ?")
    dispatch(logoutUser())
  }

  const closeSidebar = () => dispatch(toggleSidebar());

  const sidebarLinks = [
    {
      title: "Home",
      icon: "Analytics01Icon",
      sublinks: [
        { title: "Overview", path: "/" },
      ],
    },
    {
      title: "Users",
      icon: "UserMultipleIcon",
      sublinks: [
        { title: "All Users", path: "/users" },
      ],
    },
    {
      title: "Products",
      icon: "PackageIcon",
      sublinks: [
        { title: "All Products", path: "/products" },
        { title: "Add New Product", path: "/products/add-product" },
        { title: "Categories", path: "/categories" },
        { title: "Brands", path: "/brands" },
      ],
    },
    {
      title: "Orders",
      icon: "Invoice03Icon",
      sublinks: [
        { title: "All Orders", path: "/orders" },
      ],
    },
    {
      title: "Reviews",
      icon: "StarSquareIcon",
      sublinks: [
        { title: "All Reviews", path: "/reviews" },
      ],
    },
    {
      title: "Cart",
      icon: "ShoppingBag01Icon",
      sublinks: [
        { title: "Cart Mangement", path: "/cart" },
      ],
    },
  ];

  const renderIcon = (iconName) => {
    const icons = {
      Analytics01Icon,
      UserMultipleIcon,
      ProductLoadingIcon,
      ShoppingBag01Icon,
      Megaphone01Icon,
      ChartAverageIcon,
      Settings01Icon,
      HelpCircleIcon,
      StarSquareIcon,
      Invoice03Icon,
      PackageIcon
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent size={24} /> : null;
  };

  return (
    <aside className={` fixed ${isMenuHidden ? 'hidden' : 'block'} md:block h-screen ${expanded ? "w-64" : "w-16"} transition-all`}>
      <nav className="h-full flex flex-col bg-white dark:bg-zinc-900 border-r dark:border-zinc-700 shadow-sm">
        {/* Top Section */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={logo}
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
            alt="Logo"
          />
          <button onClick={closeSidebar} className="p-1.5 rounded-lg dark:text-gray-100 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            {expanded ? <ArrowLeft01Icon size={20} variant="stroke" /> : <ArrowRight01Icon size={20} variant="stroke" />}
          </button>
        </div>

        <ul className="flex-1 px-3 mt-4">
          {sidebarLinks.map((item) => (
            <li key={item.title} >
              <button onClick={() => toggleDropdown(item.title)} className="relative w-full flex items-center gap-2 px-3 py-2 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-gray-100 text-gray-600 hover:text-gray-900  dark:hover:bg-zinc-700 dark:text-gray-400 dark:hover:text-gray-200">
                {renderIcon(item.icon)}
                <div className={`flex justify-between items-center w-full overflow-hidden transition-all ${expanded ? "w-full" : "w-0 hidden"}`} >
                  <span className="text-left "> {item.title} </span>
                  {expanded && (
                    dropdowns === item.title ? <ArrowUp01Icon size={20} variant="stroke" /> : < ArrowDown01Icon size={20} variant="stroke" />
                  )}
                </div>
                {!expanded && (
                  <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-50 text-gray-800 dark:bg-zinc-700 dark:text-gray-300 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {item.title}
                  </div>
                )}

              </button>
              {dropdowns === item.title && (
                item.sublinks && expanded && (
                  <div className="pl-10">
                    {item.sublinks.map((subItem, index) => (
                      <Link
                        key={index}
                        to={subItem.path}
                        className="flex slide-in items-center py-2 px-3 my-1 text-sm font-base rounded-md transition-colors hover:bg-gray-100 text-gray-600 hover:text-gray-900 dark:hover:bg-zinc-700 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )
              )}
            </li>
          ))}
        </ul>

        {/* Bottom Section */}
        <div className="border-t dark:border-zinc-700 border-gray-200 flex flex-col p-3 space-y-2">
          
          <ThemeToggle />

          <div onClick={handleLogout} className="relative flex items-center gap-2 py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-gray-100 text-gray-600 hover:text-gray-900  dark:hover:bg-zinc-700 dark:text-gray-400 dark:hover:text-gray-200">
            <LogoutSquare02Icon size={24} />
            <div className={`flex justify-between items-center w-full overflow-hidden transition-all ${expanded ? "w-full" : "w-0 hidden"}`} >
              <span className="text-left "> Logout </span>
            </div>

            {!expanded && (
              <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-50 text-gray-800 dark:bg-zinc-800 dark:text-gray-300 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                Logout
              </div>
            )}
          </div>

        </div>
      </nav>
    </aside>
  );
}
