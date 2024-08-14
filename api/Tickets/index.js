import express from 'express';
import { validate } from 'express-validation';
import authorize from '../../middleware/index.js';
import { createTicket, getTickets } from './controller.js';
import { create, findAll } from './validation.js';

const router = express.Router();

router.use(authorize);

router.route('/').get(validate(findAll), getTickets).post(validate(create), createTicket);

export default router;
