const mysql = require('mysql2');
require('dotenv').config();

// const connection = mysql.createConnection({
// 	host: process.env.host,
//     user: process.env.user,
//     password: process.env.password,
//     database: process.env.database,
// });

// connection.connect(function(error){
// 	if(error)
// 	{
// 		console.error('error connecting: ' + error.stack);
//         return;
// 	}
// 	else
// 	{
// 		console.log('connected as id ' + connection.threadId);
// 	}
// });

// module.exports = connection;