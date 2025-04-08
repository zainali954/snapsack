import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/authSlice';

const useGoogleAuth = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                setLoading(true);
                const response = await axios.post(
                    'http://localhost:3000/api/auth/google-login',
                    { code: codeResponse.code }, // Authorization code
                    { withCredentials: true }    // Send cookies with request
                );

                if (response.data?.success) {
                    const user = response?.data?.data;
                    dispatch(setUser(user))
                    localStorage.setItem('user', JSON.stringify(user));

                    toast.success(response.data.message || 'Authenticated successfully');
                    // navigate('/');
                } else {
                    toast.error('Login failed. Please try again later.');
                }
            } catch (error) {
                console.error(error);

                // Handle different error types
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data?.message;

                    if (status === 400) {
                        toast.error('Invalid Google login attempt. Please try again.');
                    } else if (status === 401) {
                        toast.error('Your session has expired. Please log in again.');
                    } else if (status === 500) {
                        toast.error('Server error occurred. Please try later.');
                    } else {
                        toast.error(message || 'An unexpected error occurred.');
                    }
                } else if (error.request) {
                    // Network issues
                    toast.error('Network error. Please check your internet connection.');
                } else {
                    // Other unexpected errors
                    toast.error('Something went wrong. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        },
        flow: 'auth-code',
    });

    return { loginWithGoogle, loading };
};

export default useGoogleAuth;