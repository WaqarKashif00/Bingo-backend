import knex from '../../db/index.js';

class HistoryModel {
  constructor(id) {
    this.tableName = 'history';
    this.id = id;
  }

  async create(data) {
    return knex(this.tableName)
      .insert(Object.assign(data))
      .returning('*')
      .then((rows) => rows[0]);
  }

  async find() {
    return knex(this.tableName).select(knex.raw(`history.*`)).whereRaw(knex.raw('history.is_deleted = false')).orderBy('history.created_at', 'desc');
  }


}

export default HistoryModel;
