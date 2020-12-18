const db = require("../../data/dbConfig");

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find(){
    return db('users as u')
    .select('u.id', 'u.username','u.password')
}

async function add(user){
    const [id] = await db('users').insert(user, "id")
    return findById(id)
}

function findById(id) {
  return db("users as u")
    .select("u.id", "u.username", "u.password")
    .where("u.id", id)
    .first();
}

function findBy(filter) {
  return db("users as u")
    .select("u.id", "u.username", "u.password")
    .where(filter);
}