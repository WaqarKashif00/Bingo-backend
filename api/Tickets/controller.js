import TicketsModel from './model.js';
import { Ok, InternalServerError, BadRequest } from '../../helpers/server-response.js';
import RoomsModel from '../Rooms/model.js';
import UserModel from '../Users/model.js';

const result = (total) => (total ? 'successfully' : 'not');

const createTicket = async (req, res) => {
  try {
    const currentTime = new Date().toLocaleString('en-US', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: undefined
    });

    const { room_id, ticket, user_id } = req.body;

    const checkTickets = await new TicketsModel().checkTicketsAgainstRoom({ user_id, room_id });
    if (checkTickets.length === 3) {
      return BadRequest(res, 'You can have max 3 tickets against this room.');
    }

    const existingRoom = await new RoomsModel().findOne({ id: room_id });
    if (!existingRoom) {
      return BadRequest(res, 'Room already started, you can not buy ticket now.');
    }

    const checkUserBalance = await new UserModel().checkBalance({ id: user_id, ticketPrice: existingRoom.ticket_price });
    if (!checkUserBalance) {
      return BadRequest(res, 'Low Balance.');
    }

    const twoMinsBeforeRoomStart = new Date(new Date(existingRoom.start_time) - 2 * 60000).toLocaleString('en-US', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: undefined
    });

    if (!(currentTime < twoMinsBeforeRoomStart)) {
      return BadRequest(res, 'Room is about to start, you can not buy ticket now.');
    }

    const newTicket = await new TicketsModel().create({ room_id, ticket, user_id });

    await new UserModel(user_id).update({
      wallet_balance: Number(checkUserBalance.wallet_balance) - Number(existingRoom.ticket_price)
    });

    if (checkTickets.length < 1) {
      const payload = {};

      payload.opponents = existingRoom.opponents + 1;
      payload.actual_amount = (Number(existingRoom.actual_amount) + Number(existingRoom.ticket_price)).toFixed(2).toString();
      payload.owner_amount = Number(payload.actual_amount) - (Number(payload.actual_amount) / 100) * Number(process.env.WINNER_SHARE) ?? 80;
      payload.win = Number(payload.actual_amount) - (Number(payload.actual_amount) / 100) * Number(process.env.HOUSE_SHARE) ?? 20;

      await new RoomsModel(room_id).update(payload);
    }

    if (checkTickets.length >= 1 && checkTickets.length < 4) {
      const payload = {};

      payload.actual_amount = (Number(existingRoom.actual_amount) + Number(existingRoom.ticket_price)).toFixed(2).toString();
      payload.owner_amount = Number(payload.actual_amount) - (Number(payload.actual_amount) / 100) * Number(process.env.WINNER_SHARE) ?? 80;
      payload.win = Number(payload.actual_amount) - (Number(payload.actual_amount) / 100) * Number(process.env.HOUSE_SHARE) ?? 20;

      await new RoomsModel(room_id).update(payload);
    }

    return Ok(res, 'Ticket Purchased', { ...newTicket, new_balance: Number(checkUserBalance.wallet_balance) - Number(existingRoom.ticket_price) });
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

// const getTicket = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = {};
//     data['tickets.id'] = id;
//     const task = await new TicketsModel().findOne(data);

//     return Ok(res, `Ticket ${result(task)} found`, task);
//   } catch (err) {
//     console.error(err.message);
//     return InternalServerError(res, err.message);
//   }
// };

const getTickets = async (req, res) => {
  try {
    const tickets = await new TicketsModel().find(req.query);

    return Ok(res, `Tickets ${result(tickets.length)} found`, tickets);
  } catch (err) {
    console.error(err.message);
    return InternalServerError(res, err.message);
  }
};

// const updateTicket = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await new TicketsModel(id).update(req.body);

//     return Ok(res, `Ticket ${result(task)} updated`, task);
//   } catch (err) {
//     console.error(err.message);
//     return InternalServerError(res, err.message);
//   }
// };

// const deleteTicket = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await new TicketsModel(id).update({ is_deleted: true });

//     return Ok(res, `Ticket ${result(task)} deleted`, task);
//   } catch (err) {
//     console.error(err.message);
//     return InternalServerError(res, err.message);
//   }
// };

export { createTicket, getTickets };
