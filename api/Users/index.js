import express from 'express';
import { validate } from 'express-validation';
import { createUser, loginUser } from './controller.js';
import { create, login } from './validation.js';

const router = express.Router();

router.route('/register').post(validate(create), createUser);
router.route('/login').post(validate(login), loginUser);

export default router;
