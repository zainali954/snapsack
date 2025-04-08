import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const VariantSchema = new Schema({
  variantName: { type: String, lowercase: true }, 
  value: { type: String, lowercase: true }
});

const PriceDependentAttributesSchema = new Schema({
  price: Number,
  inventory: Number,
  variants: [VariantSchema],
});

const VisualAttributesSchema = new Schema({
  name: String,
  value: String,
  image: String,
  imageUrl: String,
});

const OtherAttributesSchema = new Schema({
  name: String,
  value: String,
});

const ShippingDetailsSchema = new Schema({
  weight: Number,
  weightUnit: String,
  height: Number,
  heightUnit: String,
  length: Number,
  lengthUnit: String,
  width: Number,
  widthUnit: String,
  option: String,
  available_in: [String],
});

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  subsubcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubSubCategory" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  basePrice: { type: Number, required: true },
  currency: { type: String, required: true },
  tags: { type: [String], required: true },
  priceDependentAttributes: { type: [PriceDependentAttributesSchema], default: [] },
  visualAttributes: { type: [VisualAttributesSchema], default: [] },
  otherAttributes: { type: [OtherAttributesSchema], default: [] },
  shippingDetails: { type: ShippingDetailsSchema, required: true },
  manufacturerName: { type: String, required: true },
  manufacturerContact: { type: String, required: true },
  warrantyInformation: { type: String },
  images: { type: [String], default: [] },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  reviewCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, default: 'available' },

  // 🔹 Independent Inventory for Non-Variant Products
  inventory: { type: Number, default: 0 },

  countOfStock: {
    type: Number,
    default: function () {
      return this.calculateStock();
    },
  },
});

// 🛠 Auto-update countOfStock & status before saving
ProductSchema.pre("save", function (next) {
  this.countOfStock = this.calculateStock();
  next();
});

// 🔹 Method to calculate stock dynamically
ProductSchema.methods.calculateStock = function () {
  if (this.priceDependentAttributes.length > 0) {
    return this.priceDependentAttributes.reduce((acc, attr) => acc + attr.inventory, 0);
  }
  return this.inventory; // Fallback to general inventory if no variants exist
};

const Product = mongoose.model('Product', ProductSchema);
export default Product;
