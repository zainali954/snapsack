import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resendVerificationEmail, verifyEmail } from "../slices/authSlice";
import { toast } from "react-toastify";

const VerifyEmail = () => {
    const { user } = useSelector(state => state.auth)
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error("Invalid OTP. Please enter a 6-digit code.");
            return;
        }

        dispatch(verifyEmail({code : otp}))

    };

    useEffect(() => {
        if(!user){
            navigate('/login')
        }
        if (user?.isVerified) {
            navigate('/')
        }
    }, [user])


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 w-96 shadow-md">
                <h2 className="text-2xl font-semibold text-center text-orange-600">Verify Your Email</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Enter the 6-digit code sent to your email.</p>
                <div className="mt-4">
                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-xl tracking-widest"
                        placeholder="------"
                    />
                </div>
                <button
                    onClick={handleVerify}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg mt-4 hover:bg-orange-700 transition"
                >
                    Verify
                </button>
                <p className="text-center text-sm text-gray-500 mt-2">Didn't receive the code? <button onClick={()=>dispatch(resendVerificationEmail())} className="text-orange-500 hover:underline">Resend</button></p>
            </div>
        </div>
    );
};

export default VerifyEmail;
