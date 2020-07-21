const db = require('../database/connection');

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db('users')
    .select('id', 'username', 'department')
    .groupBy('department');
}

function findBy(filter) {
  return db('users')
    .where(filter)
    .select('id', 'username', 'department');
}

async function add(user) {
  try {
    const [id] = await db('users').insert(user, 'id');

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db('users').where({ id }).first();
}
