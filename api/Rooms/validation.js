import { Joi } from 'express-validation';

export const create = {
  body: Joi.object({
    start_time: Joi.string().required(),
    ticket_price: Joi.number().integer().optional()
    // roomId: Joi.number().integer().optional(),
    // pot: Joi.string().required(),
    // opponents: Joi.number().integer().optional(),
    // winner_name: Joi.string().allow(null).optional(),
    // status: Joi.string().allow(null).optional()
  })
};

export const findOne = {
  params: Joi.object({
    id: Joi.number().required()
  })
};

export const updateBingoNums = {
  params: Joi.object({
    id: Joi.number().required()
  }),
  query: Joi.object({
    _num: Joi.number().required()
  })
};

export const findOneAndStart = {
  params: Joi.object({
    id: Joi.number().required()
  }),
  query: Joi.object({
    user_id: Joi.string().required()
  })
};

export const findAll = {
  query: Joi.object({
    all: Joi.string().valid('true').required()
  })
};

export const update = {
  query: Joi.object({
    xb_room_id: Joi.number().required()
  })
};

export const win = {
  params: Joi.object({
    room_id: Joi.number().required()
  }),
  query: Joi.object({
    user_id: Joi.number().required()
  }),
  body: Joi.object({
    bingo_tickets: Joi.object().required()
  })
};
