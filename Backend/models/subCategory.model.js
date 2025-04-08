import mongoose from "mongoose";
import slugify from "slugify";
import SubSubCategory from "./subsubCategory.model.js";
import Category from "./category.model.js";

// SubCategory Schema
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subSubCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSubCategory"
    }
  ]
});

// Automatically generate slug before saving
subCategorySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
