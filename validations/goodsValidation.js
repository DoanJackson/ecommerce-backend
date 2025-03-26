import Joi from "joi";

const goodsSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  quantity: Joi.number().min(1).required(),
  price: Joi.number().min(1).required(),
  description: Joi.string().allow(null, ""),
  types: Joi.array().items(Joi.string().guid({ version: "uuidv4" })),
});

const goodsUpdateSchema = Joi.object({
  quantity: Joi.number().min(1),
  price: Joi.number().min(1),
  description: Joi.string().allow(null, ""),
});

const goodsPresignedUrlSchema = Joi.object({
  id_product: Joi.string().guid({ version: "uuidv4" }).required(),
  file_count: Joi.number().min(1).required(),
});

const goodsSaveImageSchema = Joi.object({
  images: Joi.array().items(
    Joi.object({
      public_id: Joi.string().required(),
      secure_url: Joi.string().required(),
    })
  ),
});

export {
  goodsPresignedUrlSchema,
  goodsSaveImageSchema,
  goodsSchema,
  goodsUpdateSchema,
};
