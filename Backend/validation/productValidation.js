import Joi from 'joi';

const variantSchema = Joi.object({
  variantName: Joi.string().required(),
  value: Joi.string().required(),
});

const priceDependentAttributesSchema = Joi.object({
  price: Joi.number().required(),
  inventory: Joi.number().required(),
  variants: Joi.array().items(variantSchema).required(),
});

const visualAttributesSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.string().required(),
  imageUrl: Joi.string().allow(null, ''),
});

const otherAttributesSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.string().required(),
});

const shippingDetailsSchema = Joi.object({
  weight: Joi.number().required(),
  weightUnit: Joi.string().required(),
  height: Joi.number().required(),
  heightUnit: Joi.string().required(),
  length: Joi.number().required(),
  lengthUnit: Joi.string().required(),
  width: Joi.number().required(),
  widthUnit: Joi.string().required(),
  option: Joi.string().required(),
  available_in: Joi.array().items(Joi.string()).required(),
});

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name field cannot be empty',
    'any.required': 'Name is a required field'
  }),
  description: Joi.string().required(),
  category: Joi.string().required(),
subcategory: Joi.string().allow(null, "").optional(),
subsubcategory: Joi.string().allow(null, "").optional(),

  brand: Joi.string().required(),
  basePrice: Joi.number().required(),
  currency: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  priceDependentAttributes: Joi.array().items(priceDependentAttributesSchema).optional(),
  visualAttributes: Joi.array().items(visualAttributesSchema).optional(),
  otherAttributes: Joi.array().items(otherAttributesSchema).optional(),
  shippingDetails: shippingDetailsSchema.required(),
  manufacturerName: Joi.string().required(),
  manufacturerContact: Joi.string().required(),
  warrantyInformation: Joi.string().optional(),
  productImages: Joi.array().items(Joi.string()).optional(),
  reviewCount: Joi.number().default(0),
  averageRating: Joi.number().default(0),
  isFeatured: Joi.boolean().default(false),
  status: Joi.string().default('available'),
  countOfStock: Joi.number().default(0),
});

export { productSchema };
