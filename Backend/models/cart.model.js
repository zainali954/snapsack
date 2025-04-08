import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variant: { type: String }, // Store variant ID as a string
  visualAttributes: [{ type: String }], // Store visual attribute IDs as strings
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
}, {timestamps : true});

const Cart = mongoose.model("Cart", CartItemSchema);
export default Cart;


