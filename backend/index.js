const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main App API
app.get('/api/status', (req, res) => {
    res.json({
        status: 'success',
        service: 'Backend API',
        message: 'Backend is up and running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/data', (req, res) => {
    // Simulated database query or complex logic
    res.json({
        users: 1432,
        activeSessions: 243,
        requestsProcessed: 59384,
        uptime: process.uptime()
    });
});

app.listen(port, () => {
    console.log(`Backend service listening at http://localhost:${port}`);
});
