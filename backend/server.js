require('dotenv').config();
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
