import knex from '../../db/index.js';

class UserModel {
  constructor(id) {
    this.tableName = 'user';
    this.id = id;
  }

  async create(data) {
    return knex(this.tableName)
      .insert(Object.assign(data))
      .returning('*')
      .then((rows) => rows[0]);
  }

  async find(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, ...data })
      .orderBy('created_at', 'desc');
  }

  async checkBalance(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, id: data.id })
      .whereRaw(knex.raw(`wallet_balance >= ${data.ticketPrice}`))
      .orderBy('created_at', 'desc')
      .first();
  }

  async findOne(data) {
    return knex(this.tableName)
      .where({ is_deleted: false, ...data })
      .orderBy('created_at', 'desc')
      .first();
  }

  async findOneWallet(data) {
    return knex(this.tableName)
      .select(`wallet_balance`)
      .where({ is_deleted: false, ...data })
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

  async refund(data) {
    return knex(this.tableName)
      .where({ id: this.id })
      .update({
        wallet_balance: data.refund
      })
      .returning('*')
      .then((rows) => rows[0]);
  }

  async hardDelete() {
    return knex(this.tableName).where({ id: this.id }).del();
  }
}

export default UserModel;
