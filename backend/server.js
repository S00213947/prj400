const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/playerManagementDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/players', playerRoutes);

const teamRoutes = require('./routes/teamRoutes');
app.use('/api/teams', teamRoutes);

const coachRoutes = require('./routes/coachRoutes');
app.use('/coaches', coachRoutes);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
