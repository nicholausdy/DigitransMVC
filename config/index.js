require('dotenv').config();

const config = {
  port: 2020,
  hostURL: process.env.HOST_URL,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: 'postgres',
  },
  natsIP: process.env.NATS_IP,
  mailer: {
    username: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },
  jwtPass: process.env.JWT_PASS,
  loginURL: process.env.LOGIN_URL,
};

module.exports = config;
