import RoomsModel from './model.js';
import HistoryModel from '../History/model.js';
import { Ok, InternalServerError, BadRequest } from '../../helpers/server-response.js';
import randomNumGenerator from '../../helpers/bingoRandomNumbers.js';
// import TicketsModel from '../Tickets/model.js';
// import UserModel from '../Users/model.js';

const result = (total) => (total ? 'successfully' : 'not');

// const checkSequence = (bingoArr, sequence) => {
//   const str1 = bingoArr.slice(bingoArr.indexOf(sequence[0]), bingoArr.indexOf(sequence.length - 1) + 1).join();
//   const str2 = sequence.join();

//   if (str1 == str2) {
//     return true;
//   }

//   return false;
// };

const createRoom = async (req, res) => {
  try {
    const { start_time, ticket_price } = req.body;
    const bingoNums = randomNumGenerator().filter((x) => x !== 0);

    const room = await new RoomsModel().create({ start_time, ticket_price, bingoNums });

    return Ok(res, `Room ${result(room)} created`, room);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await new RoomsModel().startedOne({ id });

    return Ok(res, `Room ${result(room)} started!`, room);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

const updateBingoNumsInDB = async (req, res) => {
  // try {
  //   const { id } = req.params;
  //   const { _num } = req.query;
  //   const startedRoom = await new RoomsModel().startedOne({ id });
  //   if (!startedRoom) {
  //     return BadRequest(res, 'Cannot update bingo numbers.');
  //   }
  //   const existingNums = JSON.parse(startedRoom.bingo_nums)?.nums ?? false;
  //   if (!existingNums) {
  //     await new RoomsModel(id).update({ finished: true });
  //     return Ok(res, `Room Closed`, {});
  //   }
  //   if (_num != existingNums.shift()) {
  //     return BadRequest(res, '');
  //   }
  //   // console.log(existingNums);
  //   const room = await new RoomsModel(id).updateStartedOne({ existingNums });
  //   return Ok(res, `Bingo Numbers updated!`, room);
  // } catch (err) {
  //   console.error(err.message);
  //   return InternalServerError(res, err.message);
  // }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await new RoomsModel().find();

    return Ok(res, `Rooms ${result(rooms.length)} found`, rooms);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

const endRoom = async (req, res) => {
  try {
    const { xb_room_id } = req.query;
    const room = await new RoomsModel().startedOne({ id: xb_room_id });
    await new RoomsModel(xb_room_id).update({ finished: true });

    await new HistoryModel().create({
      room_id: xb_room_id,
      opponents: room.opponents,
      winner: 'None',
      winning_price: room.win,
      time: room.start_time
    });

    return Ok(res, `Room ended!`, room);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

const winRoom = async (req, res) => {
  // try {
  //   let flagA = false;
  //   let flagB = false;
  //   let flagC = false;
  //   const { room_id } = req.params;
  //   const { user_id } = req.query;
  //   const { bingo_tickets } = req.body;
  //   const existingRoom = await new RoomsModel().activeOne({ id: room_id });
  //   if (!existingRoom) {
  //     return BadRequest(res, 'Too slow to BINGO.');
  //   }
  //   const existingTickets = await new TicketsModel().find({ room_id, user_id });
  //   if (!existingTickets) {
  //     return existingTickets(res, 'Non relevant BINGO tickets.');
  //   }
  //   const user = await new UserModel().findOne({ id: user_id });
  //   const sequence = Object.keys(bingo_tickets).map((key, idx) => ({
  //     [`ticket${idx}`]: Object.keys(bingo_tickets[key]).filter((rowNo) => bingo_tickets[key][rowNo].length === 5).length
  //       ? Object.keys(bingo_tickets[key]).filter((rowNo) => bingo_tickets[key][rowNo].length === 5)[0]
  //       : ''
  //   }));
  //   const sq1 = sequence[0]?.ticket0 ? bingo_tickets.ticket0[sequence[0].ticket0] : false;
  //   const sq2 = sequence[1]?.ticket1 ? bingo_tickets.ticket1[sequence[1].ticket1] : false;
  //   const sq3 = sequence[2]?.ticket2 ? bingo_tickets.ticket2[sequence[2].ticket2] : false;
  //   const actualSequence = JSON.parse(existingRoom.bingo_nums).nums;
  //   if (sq1) {
  //     flagA = checkSequence(actualSequence, sq1);
  //   }
  //   if (sq2) {
  //     flagB = checkSequence(actualSequence, sq2);
  //   }
  //   if (sq3) {
  //     flagC = checkSequence(actualSequence, sq3);
  //   }
  //   if (flagA || flagB || flagC) {
  //     console.log('BINGO');
  //     return Ok(res, 'BINGO!!!', { winner: user.name, prize: existingRoom.win });
  //   }
  //   return BadRequest(res, 'Better Luck Next Time!', {});
  // } catch (err) {
  //   console.error(err.message);
  //   return InternalServerError(res, err.message);
  // }
};

export { createRoom, getRoom, getRooms, endRoom, winRoom, updateBingoNumsInDB };
