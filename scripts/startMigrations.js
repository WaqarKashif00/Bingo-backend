import db from '../db/index.js';

db.migrate
  .latest()
  .then(() => {
    return db.seed.run();
  })
  .then(() => {});

// Run this in CMD if above function fails
// knex migrate:latest --env local
