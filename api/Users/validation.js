import { Joi } from 'express-validation';

export const create = {
  body: Joi.object({
    name: Joi.string().required(),
    user_name: Joi.string().required(),
    password: Joi.string().allow('').optional()
  })
};

export const login = {
  body: Joi.object({
    user_name: Joi.string().required(),
    password: Joi.string().required()
  })
};

export const findOne = {
  params: Joi.object({
    id: Joi.number().required()
  })
};

export const findAll = {
  query: Joi.object({
    type: Joi.string().valid('billing', 'shipping').optional()
  })
};

export const update = {
  params: Joi.object({
    id: Joi.number().required()
  }),
  body: Joi.object({
    name: Joi.string().optional(),
    password: Joi.string().optional()
  })
};

export const deleted = {
  params: Joi.object({
    id: Joi.number().required()
  })
};
