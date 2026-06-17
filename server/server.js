const express = require('express');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const mongoose = require('mongoose');

const profileRoutes = require('./routes/profile');

require('dotenv').config();






const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/auth",  authRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

