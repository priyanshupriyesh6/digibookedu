const { writeActivity } = require('../utils/logger');

async function createLog({ type, message, user }) {
  if (!message || !message.trim()) {
    const error = new Error('Log message is required.');
    error.status = 400;
    throw error;
  }

  const line = writeActivity({ type: type || 'INFO', message: message.trim(), user: user || 'Anonymous' });
  return { success: true, line: line.trim() };
}

module.exports = {
  createLog
};
