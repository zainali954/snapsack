import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../slices/authSlice";
import { toast } from "react-toastify";
import useGoogleAuth from "../../utils/useGoogleLoginAuth";
import Loader from "../../components/Loader";

const Login = () => {
  const { user } = useSelector(state => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/");
    }
  }, [user, navigate]);

const {loginWithGoogle, loading} = useGoogleAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      console.error("Login Failed:", err);
    }
  };


  return (
    <>
    {loading && <Loader/>}
    <div className="relative min-h-screen flex items-center justify-center p-6 ">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-50 dark:bg-zinc-900 bg-[linear-gradient(to_right,#FFA5000a_1px,transparent_1px),linear-gradient(to_bottom,#FFA5000a_1px,transparent_1px)] bg-[size:54px_64px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-orange-400 opacity-20 blur-[100px]"></div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 shadow-sm  backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-zinc-700 flex flex-col justify-center space-y-6">
        <h1 className="text-4xl font-sans font-bold text-center text-gray-800 dark:text-white">
          Welcome Back!
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Login to continue to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-sm border rounded-lg dark:bg-zinc-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-orange-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-sm border rounded-lg dark:bg-zinc-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-orange-400"
              placeholder="Enter your password"
            />
          </div>
          <Link to={'/forgot-password'} className="text-xs hover:text-orange-500 dark:text-zinc-400">Forgot password?</Link>
          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-400"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-between mt-4">
          <hr className="w-1/5 border-gray-300 dark:border-gray-700" />
          <p className="text-sm text-gray-500 dark:text-gray-400">OR</p>
          <hr className="w-1/5 border-gray-300 dark:border-gray-700" />
        </div>

        {/* Google Sign-Up Button */}
        <button
          onClick={loginWithGoogle}
          className="flex items-center gap-2 justify-center w-full px-4 py-3 text-sm font-medium text-gray-600 bg-zinc-100 border rounded-lg hover:bg-zinc-200 dark:bg-zinc-700 dark:border-gray-600 dark:text-gray-300"
        >
          <svg  xmlns="http://www.w3.org/2000/svg"  width={20}  height={20}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" /></svg>
          Login with Google
        </button>

        
      </div>
    </div>
    </>
  );
};

export default Login;
