const express = require('express');
const app = express();

// Existing middleware and route imports
// const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes');
// ... other imports

// Health route import
const healthRoutes = require('./routes/healthRoutes');

// Existing middleware setup
// app.use(express.json());
// app.use('/users', userRoutes);
// app.use('/products', productRoutes);
// ... other route registrations

// Register health endpoint
app.use('/health', healthRoutes);

// Export the app for server startup and testing
module.exports = app;
