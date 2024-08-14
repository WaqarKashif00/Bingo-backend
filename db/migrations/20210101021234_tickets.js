export const up = (knex) => {
  return knex.schema.createTable('tickets', (table) => {
    table.increments();
    table.integer('room_id');
    table.integer('user_id');
    table.json('ticket');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').defaultTo(false);
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('tickets').then(() => {
    return knex.raw('DROP TYPE tickets_types');
  });
};
