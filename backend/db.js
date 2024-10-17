const { Sequelize } = require('sequelize');

// Create a Sequelize instance and connect to the PostgreSQL database
// Replace 'task_manager' with the name of the database you created, 'tailor' and 'password' are your database username and password.
const sequelize = new Sequelize('task_manager', 'tailor', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log  // Ensure that SQL statements are logged to the console
});

// Test the database connection to ensure Sequelize can connect to PostgreSQL successfully
sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

