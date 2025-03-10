const bcrypt = require('bcryptjs');
const db = require('../helpers/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // Validate if email already exists
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw `Email "${params.email}" is already registered`;
  }

  // Create user object
  const user = new db.User(params);

  // Hash password before saving
  if (params.password) {
    user.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // Save user to the database
  await user.save();
  return user;
}

async function update(id, params) {
  const user = await getUser(id);

  // Validate if the username is being changed and already exists
  const usernameChanged = params.username && user.username !== params.username;
  if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
    throw `Username "${params.username}" is already taken`;
  }

  // Hash new password if it was provided
  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // Update user data
  Object.assign(user, params);
  await user.save();
  return user;
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// Helper function to get user by ID
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw 'User not found';
  return user;
}