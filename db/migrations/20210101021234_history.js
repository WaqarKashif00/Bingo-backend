export const up = (knex) => {
  return knex.schema.createTable('history', (table) => {
    table.increments();
    table.integer('room_id');
    table.integer('opponents').defaultTo(0);
    table.string('winner');
    table.string('winning_price');
    table.string('time');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').defaultTo(false);
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('history').then(() => {
    return knex.raw('DROP TYPE history_types');
  });
};
