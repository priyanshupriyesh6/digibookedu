const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', 'activity.log');

function writeActivity({ type = 'INFO', message, user = 'Anonymous' }) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const line = `[${timestamp}] [${type}] [${user}] ${message}\n`;
  fs.appendFileSync(LOG_PATH, line);
  return line;
}

module.exports = {
  writeActivity
};
