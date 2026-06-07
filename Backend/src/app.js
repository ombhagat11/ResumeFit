const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { securityHeaders, simpleRateLimit } = require('./middlewares/security.middleware');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(securityHeaders);
app.use(simpleRateLimit({ max: Number(process.env.RATE_LIMIT_MAX || 180) }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ResumeFit Career Copilot' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/analyses', require('./routes/analysis.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
