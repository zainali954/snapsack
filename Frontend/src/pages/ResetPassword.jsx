import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { resetPassword } from "../slices/authSlice";

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }

    if (!token) {
      toast.warn("Token is required. Please request a new token.");
      return;
    }

    dispatch(resetPassword({token, password}))
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded-md mt-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
          >
            Reset Password
          </button>
        </form>
        <div className="flex items-center justify-between mt-2">
        <p className="text-xs">Go to <Link to="/login" className='hover:text-orange-500'>Login Page</Link></p>
        <Link to="/forgot-password" className='text-xs hover:text-orange-500'>Resend Email</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
