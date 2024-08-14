import knex from '../../db/index.js';

class RoomsModel {
  constructor(id) {
    this.tableName = 'rooms';
    this.id = id;
  }

  async create(data) {
    return knex(this.tableName)
      .insert({
        start_time: data.start_time,
        ticket_price: data.ticket_price,
        bingo_nums: { nums: data.bingoNums },
        actual_bingo_nums: { nums: data.bingoNums }
      })
      .returning('*')
      .then((rows) => rows[0]);
  }

  async find(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, finished: false, ...data })
      .orderBy('created_at', 'asc');
  }

  async failedRooms(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, finished: false, about_to_start: true, started: false })
      .whereRaw(`opponents <= 1`)
      .orderBy('created_at', 'asc');
  }

  async findOne(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, about_to_start: false, finished: false, started: false, ...data })
      .orderBy('created_at', 'desc')
      .first();
  }

  async findOneBingoNums() {
    return knex(this.tableName)
      .select('bingo_nums')
      .from(this.tableName)
      .where({ is_deleted: false, about_to_start: true, finished: false, started: true })
      .whereRaw('opponents > 1')
      .orderBy('created_at', 'asc')
      .first();
  }

  async startedOne(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, about_to_start: true, finished: false, started: true, ...data })
      .orderBy('created_at', 'desc')
      .first();
  }

  async fetchRoom() {
    return knex(this.tableName)
      .where({ is_deleted: false, about_to_start: true, finished: false, started: true })
      .whereRaw('opponents > 1')
      .orderBy('created_at', 'asc')
      .first();
  }

  async updateStartedOne(data) {
    return (
      knex(this.tableName)
        .where({ id: this.id, is_deleted: false, about_to_start: true, finished: false, started: true })
        // .jsonSet('bingo_nums', '$.name', { nums: data.existingNums }, 'bingo_nums')
        .update('bingo_nums', JSON.stringify({ nums: data.existingNums }))
        // .update({ bingo_nums: { nums: data.existingNums } })
        .returning('*')
        .then((rows) => rows[0])
    );
  }

  async activeOne(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, about_to_start: true, finished: false, started: true, ...data })
      .orderBy('created_at', 'desc')
      .first();
  }

  async update(data) {
    return knex(this.tableName)
      .where({ id: this.id })
      .update(data)
      .returning('*')
      .then((rows) => rows[0]);
  }

  async startRoom(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, finished: false, started: data.started, about_to_start: data.about_to_start })
      .whereRaw(`opponents > 1 and start_time = '${data.start_time}'`)
      .orderBy('created_at', 'desc');
  }

  async closeRoom(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, about_to_start: true, started: false, finished: false })
      .whereRaw('start_time = ?', data.time)
      .update({ started: true })
      .returning('*')
      .then((rows) => rows[0]);
  }

  // async preventTicketSale(data) {
  //   // return knex(this.tableName)
  //   //   .where({ is_deleted: false, about_to_start: false, started: false, finished: false })
  //   //   .whereRaw('stop_ticket_sale = ?', `${minutesDifferenceBetweenDates(this.tableName.stop_ticket_sale, data.currentTime)}`)
  //   //   .update({
  //   //     about_to_start: true,
  //   // updated_at: new Date().toLocaleString('en-US', {
  //   //   hour12: false,
  //   //   year: 'numeric',
  //   //   month: '2-digit',
  //   //   day: '2-digit',
  //   //   hour: '2-digit',
  //   //   minute: '2-digit',
  //   //   second: '2-digit'
  //   // })
  //   // })
  //   //   .returning('*')
  //   //   .then((rows) => rows[0]);

  //   return knex(this.tableName)
  //     .where({ is_deleted: false, about_to_start: false, started: false, finished: false })
  //     .whereRaw('start_time > ? and start_time <= ?', [data.minsBeforeCurrentTime, data.currentTime])
  //     .update({
  //       about_to_start: true,
  //       updated_at: new Date().toLocaleString('en-US', {
  //         hour12: false,
  //         year: 'numeric',
  //         month: '2-digit',
  //         day: '2-digit',
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         second: '2-digit'
  //       })
  //     })
  //     .returning('*')
  //     .then((rows) => rows[0]);

  //   // return knex
  //   //   .select('*')
  //   //   .from(this.tableName)
  //   //   .join(knex.raw('natural full join table1'))
  //   //   .where('id', 1)
  //   //   .returning('*')
  //   //   .then((rows) => rows[0]);

  //   // SELECT * FROM bingo.rooms where 'currentTime' < 'twoMinsBeforeGameStartTime';

  //   //   return knex(this.tableName)
  //   //     .innerJoin(this.tableName, function () {
  //   //       this.on(
  //   //         `${data.currentTime}`,
  //   //         '<',
  //   //         `${new Date(new Date(`${this.tableName.start_time}`) - 2 * 60000).toLocaleString('en-US', {
  //   //           hour12: false,
  //   //           year: 'numeric',
  //   //           month: '2-digit',
  //   //           day: '2-digit',
  //   //           hour: '2-digit',
  //   //           minute: '2-digit',
  //   //           second: undefined
  //   //         })}`
  //   //       );
  //   //     })
  //   //     .returning('*')
  //   //     .then((rows) => rows[0]);
  // }

  async hardDelete() {
    return knex(this.tableName).where({ id: this.id }).del();
  }
}

export default RoomsModel;
