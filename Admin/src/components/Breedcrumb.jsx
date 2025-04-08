import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation(); // Get current URL
  const pathnames = location.pathname.split("/").filter((x) => x); // Remove empty segments

  return (
    <nav className="text-sm text-gray-600 dark:text-gray-300">
      <ul className="flex space-x-2">
        <li>
          <Link to="/" className="text-orange-600 hover:underline">
            Home
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={index} className="flex items-center capitalize mb-2">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-gray-500 ">{decodeURIComponent(value)}</span>
              ) : (
                <Link to={pathTo} className="text-orange-600 hover:underline">
                  {decodeURIComponent(value)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
