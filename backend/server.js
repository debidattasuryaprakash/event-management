const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Add below app.use(cors()) and express.json()
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

const registrationRoutes = require('./routes/registrationRoutes');
app.use('/api/register', registrationRoutes);

const certificateRoutes = require('./routes/certificateRoutes');
app.use('/api/certificates', certificateRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API running...');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => console.log(err));
