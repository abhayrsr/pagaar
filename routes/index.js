var express = require("express");
var router = express();

var database = require("../database");
const bodyParser = require("body-parser");

router.use(express.json());
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.post("/login", function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;

  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    // database.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    // 	// If there is an issue with the query, output the error
    // 	if (error) throw error;
    // 	// If the account exists
    // 	if (results.length > 0) {
    //
    // 		// Redirect to home page
    response.send(username);
    // 	} else {
    // 		response.send('Incorrect Username and/or Password!');
    // 	}
    // 	response.end();
    // });
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

module.exports = router;
