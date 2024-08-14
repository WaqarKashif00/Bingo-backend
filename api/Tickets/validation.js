import { Joi } from 'express-validation';

export const create = {
  body: Joi.object({
    room_id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required(),
    ticket: Joi.object().required()
  })
};

export const findOne = {
  params: Joi.object({
    id: Joi.number().required()
  })
};

export const findAll = {
  query: Joi.object({
    user_id: Joi.number().integer().required(),
    room_id: Joi.number().integer().required()
  })
};

// export const update = {
//   params: Joi.object({
//     id: Joi.number().required()
//   }),
//   body: Joi.object({
//     opponents: Joi.number().integer().optional(),
//     win: Joi.number().integer().optional(),
//     time: Joi.string().optional()
//   })
// };

// export const deleted = {
//   params: Joi.object({
//     id: Joi.number().required()
//   })
// };
