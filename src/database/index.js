require('dotenv').config();
const { Pool } = require('pg');

const dbConfig = { connectionString: process.env.DATABASE_URL };
const connection = new Pool(dbConfig);

module.exports = connection;
