require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
app.use(cors()); // Apply CORS middleware globally before defining routes

const server = http.createServer(app);
const io = new Server(server);

// Assuming your module implementations are correct
const { getRealTimeData } = require('./src/api/realTimeData');
const { getHistoricalData } = require('./src/api/historicalData');
const errorHandler = require('./src/utils/errorHandler');

const clientPath = process.env.CLIENT_DIR || path.join(__dirname, 'stock-price-tracker');
app.use(express.static(clientPath));


// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Stock Price Tracker Server!');
});

// Real-time data route
app.get('/api/realtime/:symbol', async (req, res) => {
    try {
        const data = await getRealTimeData(req.params.symbol);
        res.json(data);
    } catch (error) {
        console.error('Error fetching real-time data:', error);
        res.status(500).send('Failed to fetch real-time data');
    }
});

// Historical data route
app.get('/api/historical/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const { from, to } = req.query;

    try {
        const data = await getHistoricalData(symbol, from, to);
        res.json(data);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).send('Failed to fetch historical data');
    }
});

// Use the error handling middleware last, after all route handlers
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Other setup remains unchanged

module.exports = { app, server };  // Export both app and server if needed elsewhere
