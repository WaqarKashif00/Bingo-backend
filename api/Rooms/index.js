import express from 'express';
import { validate } from 'express-validation';
import { createRoom, getRoom, getRooms, endRoom, updateBingoNumsInDB } from './controller.js';
import { create, findOne, findAll, update, updateBingoNums } from './validation.js';
import authorize from '../../middleware/index.js';

const router = express.Router();

router.use(authorize);

router.route('/').post(validate(create), createRoom).get(validate(findAll), getRooms);
router.route('/end_game').get(validate(update), endRoom);
router.route('/:id').get(validate(findOne), getRoom);
// router.route('/update/:id').get(validate(updateBingoNums), updateBingoNumsInDB);

export default router;
