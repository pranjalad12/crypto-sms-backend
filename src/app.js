const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const webhookRoutes = require('./routes/Webhook');
const userRoutes = require('./routes/UserRoutes');
const qrRoutes = require('./routes/qrCodeRoutes');
const keyAndSignatureRoutes = require('./routes/keyAndSignatureRoutes');

mongoose.connect('mongodb+srv://baderiapalash:8iXRwCkToZF68ifX@cluster0.bs8qg.mongodb.net/CryptoSMS?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api', userRoutes);
app.use('/api', qrRoutes);
app.use('/api', keyAndSignatureRoutes);
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
