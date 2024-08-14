import express from 'express';
import { getHistory } from './controller.js';
import authorize from '../../middleware/index.js';

const router = express.Router();

router.use(authorize);

router.route('/').get(getHistory);

export default router;
