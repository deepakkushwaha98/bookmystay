const express = require('express');
const authRoutes = require('./routes/auth');
const cors = require('cors');   // cross origin resource sharing
const mongoose = require('mongoose');

const listingRoutes = require("./routes/listing")
const profileRoutes = require('./routes/profile');
const bookingRoutes = require("./routes/booking")
require('dotenv').config();






const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/auth",  authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings" , bookingRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

