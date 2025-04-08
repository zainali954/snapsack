import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        // For variant and visualAttributes, reference the Product collection directly.
        variant: { type : String },
        visualAttributes: [{ type: String }],
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      }
    ],
    address: { type: AddressSchema, required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: { 
      type: String, 
      enum: ["COD", "Credit Card", "Bank Transfer"], 
      required: true 
    },
    paymentStatus: {
      type: String,
      enum: ["Not Paid", "Paid", "Refunded"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save hook to set paymentStatus based on paymentMethod
OrderSchema.pre("save", function (next) {
  if (this.paymentMethod === "COD") {
    this.paymentStatus = "Not Paid";
  } else if (!this.paymentStatus) {
    // For non-COD methods, you may want to default to "Paid" or leave it to be updated after payment processing
    this.paymentStatus = "Paid";
  }
  next();
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
