import Joi from "joi";

// CREATE TABLE goods(
//     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//     name varchar(100) NOT NULL,
//     quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
//     number_sold INTEGER NOT NULL DEFAULT 0 CHECK (number_sold >= 0),
//     price numeric(15,2) NOT NULL CHECK (price >= 0),
//     description TEXT,
//     created_at TIMESTAMPTZ DEFAULT NOW()
// );
const goodsSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  quantity: Joi.number().min(1).required(),
  price: Joi.number().min(1).required(),
  description: Joi.string().allow(null, ""),
  types: Joi.array().items(Joi.string()),
});

export { goodsSchema };
