import './App.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Home from './pages/Home';
import Header from './Components/Header';
import Listing from './pages/Listing';
import Footer from './Components/Footer';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Loader from './Components/Loader';

import { fetchBrands, fetchCategories, fetchOffers, fetchProducts } from './slices/productSlice';
import { clearNotification } from './slices/notificationSlice';
import { fetchCart } from './slices/cartSlice';
import OrderPage from './pages/OrderPage';
import OrderHistory from './pages/OrderHistory';
import UserProfile from './pages/UserProfile';
import VerifyEmail from './pages/verifyEmail';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Wishlist from './pages/Wishlist';
import { setNavigateFunction } from './utils/navigationHelper';
import { fetchWishlist } from './slices/wishlistSlice';
import ScrollToTop from './Components/ScrollToTop';


const MyContext = createContext();

function App() {
  const dispatch = useDispatch();

  const { message, error } = useSelector((state) => state.notification);
  const { user } = useSelector((state) => state.auth);
  const isLoading = useSelector(
    (state) => state.products.isLoading || state.auth.isLoading || state.cart.isLoading
  );

  // Fetch categories, products, and brands on app load
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchOffers())
    
    if (user) {
      dispatch(fetchWishlist())
      dispatch(fetchCart());
    }
  }, [dispatch, user]);
  

  // Handle notifications with cleanup
  useEffect(() => {
    if (error) toast.error(error);
    if (message) toast.success(message);

    const timeout = setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);

    return () => clearTimeout(timeout);
  }, [error, message, dispatch]);

  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);
  // Hide Header & Footer on login/signup pages
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-email' || location.pathname === '/forgot-password' || location.pathname === '/reset-password';

  return (
<>
      {!hideHeaderFooter && <Header />}
      {isLoading && <Loader />}
      <ToastContainer />
      <ScrollToTop/>

      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/category/:id" element={<Listing />} />
        <Route path="/products" element={<Listing />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<OrderPage />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}

      </>
  );
}

export { MyContext };
export default App;
