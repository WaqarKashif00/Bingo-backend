import cron from 'node-cron';
import RoomsModel from '../api/Rooms/model.js';
import TicketsModel from '../api/Tickets/model.js';
import UserModel from '../api/Users/model.js';
import HistoryModel from '../api/History/model.js';

// Custom Logics
const minutesDifferenceBetweenDates = (_d1, _d2) => {
  console.log(new Date().toLocaleString());
  const date1 = new Date(_d1);
  const date2 = new Date(_d2);

  // To calculate the time difference in milliseconds of two dates
  const Difference_In_Time = date1.getTime() - date2.getTime();

  // To display the final no. of days (result)
  console.log(`${date1} ${date2}: ${Difference_In_Time / 60000}`);

  return Difference_In_Time / 60000;
};

const getBalance = (a1, a2, a3 = []) => {
  a2.reduce((total, currVal) => {
    return a3.push({
      user_id: currVal.user_id,
      refund: a1
        .map((item) => {
          if (currVal.room_id === item.room_id) return item.ticket_price;
        })
        .filter((elem) => elem !== undefined)[0]
    });
  }, []);

  return a3;
};

// Listener functions
const preventTicketSale = async () => {
  console.log('preventTicketSale started!', process.env.STOP_SALES);

  try {
    const data = {
      currentTime: new Date().toLocaleString('en-US', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: undefined
      })
    };

    let i = 0;
    // Get all non-started rooms from db
    const rooms = await new RoomsModel().find({ started: false, about_to_start: false });

    for (i; i < rooms.length; i += 1) {
      // console.log(rooms[i]);

      // if (rooms[i].stop_ticket_sale === minutesDifferenceBetweenDates(rooms[i].start_time, data.currentTime)) {
      if (minutesDifferenceBetweenDates(rooms[i].start_time, data.currentTime) <= Number(process.env.STOP_SALES)) {
        try {
          await new RoomsModel(rooms[i].id).update({
            about_to_start: true
          });
        } catch (err) {
          console.error('preventTicketSale started!', err);
        }
      }
    }
  } catch (err) {
    console.error('preventTicketSale started!', err);
    return false;
  }
};

const startGame = async () => {
  console.log('startGame started!');

  const currentTime = new Date().toLocaleString('en-US', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: undefined
  });

  try {
    const rooms = await new RoomsModel().startRoom({ started: false, about_to_start: true, start_time: currentTime });
    let i = 0;
    for (i; i < rooms.length; i += 1) {
      try {
        await new RoomsModel(rooms[i].id).update({
          started: true
        });
      } catch (err) {
        console.error('startGame started!', err);
      }
    }
  } catch (err) {
    console.error('startGame started!', err);
    return false;
  }
};

const failedToStartRooms = async () => {
  console.log('failedToStartRooms started!');

  const currentTime = new Date().toLocaleString('en-US', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: undefined
  });

  const data = [];
  try {
    const rooms = await new RoomsModel().failedRooms({ currentTime });
    let i = 0;

    if (!rooms) {
      return false;
    }

    for (i; i < rooms.length; i += 1) {
      data.push({ room_id: rooms[i].id, ticket_price: rooms[i].ticket_price });
      try {
        await new RoomsModel(rooms[i].id).update({
          is_deleted: true,
          finished: true
        });
      } catch (err) {
        console.error('failedToStartRooms => close room', err);
      }

      try {
        // create history
        await new HistoryModel().create({
          room_id: rooms[i].id,
          opponents: rooms[i].opponents,
          winner: 'None',
          winning_price: rooms[i].win,
          time: rooms[i].start_time
        });
      } catch (err) {
        console.error('failedToStartRooms => create history against close room', err);
      }
    }

    const usersIds = await new TicketsModel().fetchUsers(data.map((x) => x.room_id).join());

    const balanceToAdd = getBalance(data, usersIds);
    console.log('balanceToAdd', balanceToAdd);
    console.log();
    console.log();
    console.log();

    let j = 0;
    for (j; j < balanceToAdd.length; j += 1) {
      const userToBeUpdated = await new UserModel().findOneWallet({ id: balanceToAdd[j].user_id });
      await new UserModel(balanceToAdd[j].user_id).refund({
        refund: (Number(balanceToAdd[j].refund) + Number(userToBeUpdated.wallet_balance)).toFixed(2).toString()
      });
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const updateBingoNumArray = async () => {
  try {
    const startedRoom = await new RoomsModel().fetchRoom();
    if (!startedRoom) {
      return 'Cannot update bingo numbers.';
    }
    const existingNums = JSON.parse(startedRoom.bingo_nums)?.nums ?? false;
    if (!existingNums) {
      await new RoomsModel(startedRoom.id).update({ finished: true });
      return `Room Closed`;
    }
    existingNums.shift();

    await new RoomsModel(startedRoom.id).updateStartedOne({ existingNums });

    return `Bingo Numbers updated!`;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

export function listenerToStopTicketPurchase() {
  return cron.schedule('* * * * *', preventTicketSale);
}

export function listenerToStartGame() {
  return cron.schedule('* * * * *', startGame);
}

export function listenerToCheckFailedRooms() {
  return cron.schedule('* * * * *', failedToStartRooms);
}

export function listenerToUpdateBingoNums() {
  return cron.schedule(`*/${Number(process.env.BINGO_NUMBER_DURATION_REMOVE)} * * * * *`, updateBingoNumArray);
}
