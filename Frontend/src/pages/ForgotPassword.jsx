import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../slices/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword({email}))
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword