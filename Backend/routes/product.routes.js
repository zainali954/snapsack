import express from 'express'
const router = express.Router();
import { getProducts, createProduct, deleteProduct, editProduct, singleImageUpload, singleImageDelete, productImageDelete, getproductById, relatedProducts, searchProducts, quickStats, feturedProducts } from '../controllers/product.controller.js';
import { upload } from '../utils/multer.js';
import { productSchema } from '../validation/productValidation.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

function validateProduct(req, res, next) {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      subsubcategory,
      brand,
      basePrice,
      currency,
      tags,
      priceDependentAttributes,
      visualAttributes,
      otherAttributes,
      shippingDetails,
      manufacturerName,
      manufacturerContact,
    } = req.body;
    // Parse and validate fields
    const productData = {
      name,
      description,
      category,
      subcategory: subcategory === "" ? null : subcategory,
      subsubcategory: subsubcategory === "" ? null : subsubcategory,
      brand,
      basePrice: Number(basePrice),
      currency,
      tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
      priceDependentAttributes: typeof priceDependentAttributes === 'string' ? JSON.parse(priceDependentAttributes).map(attribute => ({
        ...attribute,
        price: Number(attribute.price),
        inventory: Number(attribute.inventory),
        variants: Array.isArray(attribute.variants) ? attribute.variants : JSON.parse(attribute.variants),
      })) : priceDependentAttributes,
      visualAttributes: typeof visualAttributes === 'string' ? JSON.parse(visualAttributes) : visualAttributes,
      otherAttributes: typeof otherAttributes === 'string' ? JSON.parse(otherAttributes) : otherAttributes,
      shippingDetails: typeof shippingDetails === 'string' ? JSON.parse(shippingDetails) : shippingDetails,
      manufacturerName,
      manufacturerContact,
    };
    const { error } = productSchema.validate(productData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    req.productData = productData;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}


// Routes
router.post('/new', verifyAuth, verifyAdmin, upload.array('images', 10), validateProduct, createProduct);
router.delete("/delete-image/:productId", verifyAuth, verifyAdmin, productImageDelete);
router.put('/edit/:id', verifyAuth, verifyAdmin, upload.array('images', 10), editProduct)


router.get('/', getProducts)
router.get('/featured', feturedProducts)
router.get('/search',  searchProducts); 
router.get("/stats", verifyAuth, verifyAdmin, quickStats); 
router.get('/:id', getproductById);     
router.delete('/:id', verifyAuth, verifyAdmin, deleteProduct)
router.get('/related-products/:id', relatedProducts)

router.post("/visual/image",verifyAuth, verifyAdmin, upload.single('image'), singleImageUpload);
// Remove Image Endpoint
router.delete("/visual/image", verifyAuth, verifyAdmin, singleImageDelete);

export default router
