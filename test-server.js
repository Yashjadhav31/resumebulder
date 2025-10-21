const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server running' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API working', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`✅ Test server running on http://localhost:${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`🔗 API test: http://localhost:${port}/api/test`);
});
