const fs = require('fs');
const path = require('path');
// Load appropriate env file in local dev (Render injects env vars automatically)
if (process.env.NODE_ENV !== 'production') {
  const devEnvPath = path.join(__dirname, '.env.development');
  if (fs.existsSync(devEnvPath)) {
    require('dotenv').config({ path: devEnvPath });
  } else {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
  }
}
const { connectDB } = require('./db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend listening on port ${PORT}...`);

      // Self-ping every 14 minutes to prevent Render free tier spin-down
      if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
        const PING_URL = `${process.env.RENDER_EXTERNAL_URL}/health`;
        setInterval(async () => {
          try {
            const res = await fetch(PING_URL);
            const data = await res.json();
            console.log(`[keep-alive] ping OK — uptime: ${data.uptime}s`);
          } catch (err) {
            console.warn(`[keep-alive] ping failed: ${err.message}`);
          }
        }, 14 * 60 * 1000); // every 14 minutes
        console.log(`[keep-alive] self-ping enabled → ${PING_URL}`);
      }
    });
  })
  .catch((error) => {
    console.error('Failed to start server. DB connection error:', error.message);
    process.exit(1);
  });
