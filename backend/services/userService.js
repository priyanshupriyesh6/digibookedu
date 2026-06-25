const { collection } = require('../db');

async function getStudents() {
  return collection('users')
    .find({ role: 'student' }, { projection: { password: 0 } })
    .sort({ name: 1 })
    .toArray();
}

module.exports = {
  getStudents
};
