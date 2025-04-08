import mongoose from "mongoose";
import slugify from "slugify";

// SubSubCategory Schema
const subSubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory", // Reference to SubCategory
    required: true
  }
});

// Automatically generate slug before saving
subSubCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});



const SubSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);
export default SubSubCategory;
