require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});