import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import router from './routes/index.js';
import { listenerToStopTicketPurchase, listenerToStartGame, listenerToCheckFailedRooms, listenerToUpdateBingoNums } from './scheduler/index.js';
import winRoom from './win.js';
import RoomsModel from './api/Rooms/model.js';
import UserModel from './api/Users/model.js';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({ methods: '*', origin: '*' }));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Server Is UP and RUNNING');
});

app.use('/v1', router);
listenerToStopTicketPurchase();
listenerToStartGame();
listenerToCheckFailedRooms();
listenerToUpdateBingoNums();

const io = new Server(server, {
  cors: { credentials: true, allowedHeaders: ['x-access-bingo-token'], origin: [process.env.CLIENT], methods: '*' }
});

io.on('connection', (socket) => {
  socket.on(process.env.SOCKET_ON, ({ userId, roomId }) => {
    // if (error) return callback(error);

    // Emit will send data to the user
    // who had joined
    // working fine
    // socket.emit(process.env.BINGO_ROOM, { userId, roomId });

    // Broadcast will send data to everyone
    // in the room except the joined user
    // working fine
    // socket.broadcast.to(roomId).emit(process.env.BINGO_ROOM, { userId, roomId });

    // will send data to everyone
    // in this room
    // working fine
    socket.join(roomId);
    io.to(roomId).emit(process.env.BINGO_ROOM, { userId, roomId });
  });

  socket.on(process.env.SOCKET_ID, async ({ bingo_tickets, roomId, userId, win }) => {
    const $data = await winRoom(roomId, userId, bingo_tickets, win);

    socket.join(roomId);

    io.to(roomId).emit(process.env.BINGO_WINNER, { msg: $data.msg, winner: $data.winner, prize: $data.prize });
  });

  socket.on('sendUserId', async ({ userId }) => {
    const user = await new UserModel().findOneWallet({ id: userId });
    socket.join(userId);
    io.to(userId).emit('receiveWallet', { userBalance: user.wallet_balance });
  });

  socket.on(process.env.BINGO_NUMBER_DURATION_FETCH_ID, async ({ roomId }) => {
    const nums = await new RoomsModel().findOneBingoNums();

    socket.join(roomId);

    io.to(roomId).emit(process.env.BINGO_NUMBER_DURATION_SEND_ID, { nums: nums.bingo_nums });
  });

  socket.on(process.env.SOCKET_OFF, () => {
    console.info('User left from room.');
  });
});

server.listen(port);
