export const up = (knex) => {
  return knex.schema.createTable('user', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.string('token').notNullable();
    table.string('user_name').notNullable();
    table.string('password').notNullable();
    table.string('wallet_balance').defaultTo('0');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').defaultTo(false);
    table.unique('user_name');
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('user').then(() => {
    return knex.raw('DROP TYPE user_types');
  });
};
