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

router.post("/login", async function (request, response) {
  // Capture the input fields
  let username = await request.body.username;
  let password = await request.body.password;

  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password

    database.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      function (error, results) {
        // If there is an issue with the query, output the error

        try {
          // If the account exists

          if (results.length > 0) {
            return response.status(200).json({ username: username });
          } else {
            // response.send('Incorrect Username and/or Password!');
            return response
              .status(400)
              .json({ error: "Incorrect username or password" });
          }
        } catch (error) {
          return response.status(500).json({ error: "internal server error" });
        }
      }
    );
  } else {
    return response
      .status(401)
      .json({ error: "Please enter Username and Password!" });
  }
});

module.exports = router;
