// Insert dummy data into table

export const seed = (knex) => {
  const sites = [
    {
      start_time: '11:00:00',
      ticket_price: '5'
    },
    {
      start_time: '11:30:00',
      ticket_price: '10'
    },
    {
      start_time: '12:00:00',
      ticket_price: '15'
    },
    {
      start_time: '12:30:00',
      ticket_price: '20'
    },
    {
      start_time: '13:00:00',
      ticket_price: '25'
    }
  ];

  return knex('rooms')
    .insert(sites)
    .returning('*')
    .then((rows) => rows);
};

export default seed;
