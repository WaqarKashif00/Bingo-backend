export const up = (knex) => {
  return knex.schema.createTable('rooms', (table) => {
    table.increments();
    table.string('start_time');
    table.string('ticket_price');
    table.integer('opponents').defaultTo(0);
    table.json('bingo_nums');
    table.json('actual_bingo_nums');
    table.string('win').defaultTo('0');
    table.boolean('about_to_start').defaultTo(false);
    table.string('actual_amount').defaultTo('0');
    table.string('owner_amount').defaultTo('0');
    table.boolean('started').defaultTo(false);
    table.boolean('finished').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').defaultTo(false);
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('rooms').then(() => {
    return knex.raw('DROP TYPE rooms_types');
  });
};
