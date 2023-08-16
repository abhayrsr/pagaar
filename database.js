const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
require('dotenv').config();

const connection = mysql.createPool({
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database,
	Promise: bluebird
});

module.exports = connection;