import mongoose from "mongoose";
import slugify from "slugify";

// Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    minlength: [3, "Category name must be at least 3 characters"],
    maxlength: [50, "Category name cannot exceed 50 characters"],
    match: [/^[a-zA-Z0-9 &]+$/, "Category name can only contain letters, numbers, and spaces"]
  },
  image : {
    type : 'String',
    required : true
  },
  slug: {
    type: String,
    unique: true
  },
  subCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory"
    }
  ]
});

// Automatically generate slug before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);
export default Category;