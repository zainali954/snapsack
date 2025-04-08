import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../slices/authSlice";
import { toast } from "react-toastify";
import { BiLogoGoogle } from "react-icons/bi";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const formDataToSend = { name, email, password };

    dispatch(registerUser(formDataToSend));
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleSignup = () => {
    toast.error("Google Sign-Up clicked!");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#FFA5000a_1px,transparent_1px),linear-gradient(to_bottom,#FFA5000a_1px,transparent_1px)] bg-[size:54px_64px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-orange-400 opacity-20 blur-[100px]"></div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md p-8 shadow-sm bg-white backdrop-blur-xl rounded-3xl border border-gray-100 flex flex-col justify-center space-y-6">
        <h1 className="text-4xl font-sans font-bold text-center text-gray-800 dark:text-white">
          Create an Account
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Sign up to get started
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-orange-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-orange-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-orange-400"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-orange-400"
              placeholder="Re-enter your password"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-400"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-between mt-4">
          <hr className="w-1/5 border-gray-300 dark:border-gray-700" />
          <p className="text-sm text-gray-500 dark:text-gray-400">OR</p>
          <hr className="w-1/5 border-gray-300 dark:border-gray-700" />
        </div>

        {/* Google Sign-Up Button */}
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 border rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        >
          <BiLogoGoogle/>
          Sign Up with Google
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-600 hover:underline dark:text-orange-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
