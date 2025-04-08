import express from "express";
import {
  addToCart,
  clearAbondonedCarts,
  clearCart,
  filterCarts,
  getCart,
  getCartsInfo,
  removeFromCart,
  updateCartItem
} from "../controllers/cart.controller.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const userCartRoutes = express.Router();
const adminCartRoutes = express.Router();

userCartRoutes.post("/add", verifyAuth, addToCart);
userCartRoutes.put("/update", verifyAuth, updateCartItem);
userCartRoutes.get("/", verifyAuth, getCart);
userCartRoutes.post("/remove", verifyAuth, removeFromCart);
userCartRoutes.delete('/clear', verifyAuth, clearCart)

adminCartRoutes.get("/", verifyAuth, verifyAdmin, getCartsInfo)
adminCartRoutes.delete("/clear-abandoned", verifyAuth, verifyAdmin, clearAbondonedCarts);
adminCartRoutes.get("/filter", verifyAuth, verifyAdmin, filterCarts);


export { userCartRoutes, adminCartRoutes };
