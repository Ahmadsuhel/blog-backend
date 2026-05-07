const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const connectDB = async () => {
  await sequelize.authenticate();
  console.log('PostgreSQL connected successfully');

  await sequelize.sync({ force: false });
  console.log('Database tables synced');
};

module.exports = { sequelize, connectDB };