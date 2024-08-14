import HistoryModel from './api/History/model.js';
import RoomsModel from './api/Rooms/model.js';
import TicketsModel from './api/Tickets/model.js';
import UserModel from './api/Users/model.js';

// const checkSequence = (bingoArr, sequence) => {
//   const str1 = bingoArr.slice(bingoArr.indexOf(sequence[0]), bingoArr.indexOf(sequence[sequence.length - 1]) + 1).join();
//   const str2 = sequence.join();

//   if (str1 === str2) {
//     return true;
//   }

//   return false;
// };

const winRoom = async (room_id, user_id, bingo_tickets, winFlag) => {
  try {
    console.log(room_id, user_id, bingo_tickets, winFlag);
    console.log();
    console.log();
    console.log();
    // let flagA = false;
    // let flagB = false;
    // let flagC = false;

    const existingRoom = await new RoomsModel().activeOne({ id: room_id });
    if (!existingRoom) {
      return { msg: 'Too slow to BINGO.', winner: 'No One', prize: existingRoom.win };
    }

    const existingTickets = await new TicketsModel().find({ room_id, user_id });
    if (!existingTickets) {
      return { msg: 'Non relevant BINGO tickets.', winner: 'No One', prize: existingRoom.win };
    }

    const user = await new UserModel().findOne({ id: user_id });

    // const sequence = Object.keys(bingo_tickets).map((key, idx) => ({
    //   [`ticket${idx}`]: Object.keys(bingo_tickets[key]).filter((rowNo) => bingo_tickets[key][rowNo].length === 5).length
    //     ? Object.keys(bingo_tickets[key]).filter((rowNo) => bingo_tickets[key][rowNo].length === 5)[0]
    //     : ''
    // }));

    // const sq1 = sequence[0]?.ticket0 ? bingo_tickets.ticket0[sequence[0].ticket0] : false;
    // const sq2 = sequence[1]?.ticket1 ? bingo_tickets.ticket1[sequence[1].ticket1] : false;
    // const sq3 = sequence[2]?.ticket2 ? bingo_tickets.ticket2[sequence[2].ticket2] : false;

    // const actualSequence = JSON.parse(existingRoom.bingo_nums).nums;

    // console.log();
    // console.log();
    // console.log();
    // console.log();
    // console.log();
    // console.log(actualSequence);
    // console.log(sq1);
    // console.log(sq2);
    // console.log(sq3);
    // console.log();
    // console.log();
    // console.log();
    // console.log();
    // console.log();

    // if (sq1) {
    //   flagA = checkSequence(actualSequence, sq1);
    // }
    // if (sq2) {
    //   flagB = checkSequence(actualSequence, sq2);
    // }
    // if (sq3) {
    //   flagC = checkSequence(actualSequence, sq3);
    // }

    if (winFlag) {
      console.log('BINGO');

      await new RoomsModel(room_id).update({ finished: true });

      await new HistoryModel().create({
        room_id: room_id,
        opponents: existingRoom.opponents,
        winner: user.name,
        winning_price: existingRoom.win,
        time: existingRoom.start_time
      });

      const newWalletBalance = (Number(user.wallet_balance) + Number(existingRoom.win)).toFixed(2).toString();

      await new UserModel(user.id).update({ wallet_balance: newWalletBalance });

      return { msg: 'BINGO!!!', winner: user.name, prize: existingRoom.win };
    }

    return { msg: 'Better Luck Next Time!', winner: 'No One', prize: existingRoom.win };
  } catch (err) {
    console.error(err.message);
    return { msg: 'Internal Server Error', winner: 'No One', prize: null };
  }
};

export default winRoom;
