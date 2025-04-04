// -- Create orders table
// CREATE TABLE orders(
//     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//     goods_id UUID REFERENCES goods(id) ON DELETE CASCADE,
//     quantity INTEGER NOT NULL CHECK (quantity > 0),
//     total_price numeric(15,2) NOT NULL CHECK (total_price >= 0),
//     status varchar(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'canceled')),
//     created_at TIMESTAMPTZ DEFAULT NOW(),
//     city varchar(100) NOT NULL,
//     district varchar(100) NOT NULL,
//     address varchar(100) NOT NULL
// )
import Joi from "joi";

const createOrdersSchema = Joi.object({
  goods_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
  city: Joi.string().min(1).max(100).required(),
  district: Joi.string().min(1).max(100).required(),
  address: Joi.string().min(1).max(100).required(),
});

const updateOrdersSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "accepted", "completed", "canceled")
    .required(),
});

export { createOrdersSchema, updateOrdersSchema };
