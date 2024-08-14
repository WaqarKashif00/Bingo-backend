import express from 'express';
import userRoutes from '../api/Users/index.js';
import roomsRoutes from '../api/Rooms/index.js';
import historyRoutes from '../api/History/index.js';
import ticketsRoutes from '../api/Tickets/index.js';
import validationHandler from '../helpers/validation-handler.js';

const router = express.Router();

// routers
router.get('/', (req, res) => res.send('Welcome to the Bingo API!'));

router.use('/users', userRoutes);
router.use('/rooms', roomsRoutes);
router.use('/history', historyRoutes);
router.use('/tickets', ticketsRoutes);

// router handlers
router.use(validationHandler);

export default router;
