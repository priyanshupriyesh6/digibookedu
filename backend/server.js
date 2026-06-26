const path = require('path');
// Load .env only in local dev (Render injects env vars automatically)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}
const { connectDB } = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend listening on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server. DB connection error:', error.message);
    process.exit(1);
  });
