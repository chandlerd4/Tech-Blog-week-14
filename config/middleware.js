// Import necessary modules
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./database');
require('dotenv').config();

// Define session middleware configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET, // Secret key for session encryption
  store: new SequelizeStore({
    db: sequelize, // Sequelize instance for session storage
    tableName: 'Sessions', // Optionally specify the table name
    schema: 'tech_blog_schema', // Optionally specify schema if needed
  }),
  resave: false, // Do not save session if unmodified
  saveUninitialized: false, // Do not save uninitialized sessions
  cookie: {
    maxAge: 1800000, // Cookie expiration time in milliseconds (30 minutes)
  },
};

// Create and export session middleware
const sessionMiddleware = session(sessionConfig);
module.exports = sessionMiddleware;
