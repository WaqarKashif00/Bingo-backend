import knex from '../../db/index.js';

class TicketsModel {
  constructor(id) {
    this.tableName = 'tickets';
    this.id = id;
  }

  async create(data) {
    return knex(this.tableName)
      .insert({ ticket: JSON.stringify(data.ticket), room_id: data.room_id, user_id: data.user_id })
      .returning('*')
      .then((rows) => rows[0]);
  }

  async find(data) {
    return knex(this.tableName)
      .select(knex.raw(`tickets.*`))
      .whereRaw(knex.raw('tickets.is_deleted = false'))
      .where(data)
      .orderBy('tickets.created_at', 'desc');
  }

  async fetchUsers(data) {
    return knex(this.tableName)
      .select(`user_id`, `room_id`)
      .from('tickets')
      .where({ is_deleted: false })
      .whereRaw(knex.raw(`room_id in (${data})`))
      .orderBy('created_at', 'desc');
  }

  async findOne(data) {
    return knex(this.tableName)
      .select(knex.raw(`tickets.*`))
      .whereRaw(knex.raw('tickets.is_deleted = false'))
      .where(data)
      .orderBy('tickets.created_at', 'desc')
      .first();
  }

  async checkTicketsAgainstRoom(data) {
    return knex(this.tableName)
      .select(knex.raw(`tickets.*`))
      .whereRaw(knex.raw('tickets.is_deleted = false'))
      .where(data)
      .orderBy('tickets.created_at', 'desc');
  }

  async update(data) {
    return knex(this.tableName)
      .where({ id: this.id })
      .update(data)
      .returning('*')
      .then((rows) => rows[0]);
  }

  async hardDelete() {
    return knex(this.tableName).where({ id: this.id }).del();
  }
}

export default TicketsModel;
