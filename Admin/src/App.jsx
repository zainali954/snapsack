import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./slices/categorySlice";
import { fetchBrands } from "./slices/brandSlice";
import { fetchProducts } from "./slices/productSlice";

import NotFound from "./pages/NotFound";
import AdminHome from "./pages/AdminHome";
import Loader from './components/Loader';
import { fetchOrders } from "./slices/orderSlice";
import { clearNotification } from "./slices/notificationSlice";
import { fetchUsers } from "./slices/usersSlice";
import { fetchReviews } from "./slices/reviewsSlice";
import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/Signup"
import { setNavigateFunction } from "./utils/navigationHelper";
import { fetchCart } from "./slices/cartSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector( (state) => state.auth)
  const { error, message } = useSelector((state) => state.notification)


  const isLoading = useSelector((state) =>
    state.brands?.isLoading ||
    state.categories?.isLoading ||
    state.products?.isLoading ||
    state.orders?.isLoading ||
    state.users?.isLoading
  );

  const navigate = useNavigate()
  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  // App.jsx or useEffect in Redux Store
  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchUsers());
      dispatch(fetchCategories());
      dispatch(fetchProducts());
      dispatch(fetchBrands())
      dispatch(fetchOrders())
      dispatch(fetchReviews())
      dispatch(fetchCart())
    }
  }, [user]); 


  useEffect(() => {
    if (error) toast.error(error);
    if (message) toast.success(message);

    const timeout = setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);

    return () => clearTimeout(timeout);
  }, [error, message, dispatch]);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={"dark"}
        limit={5}
      />
      {isLoading && <Loader />}
      <Routes>
        <Route path="/*" element={<AdminHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<AdminHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
