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

export { goodsSchema, goodsUpdateSchema };
