var express = require("express");
var router = express();
var status = require("http-status");

const database = require("../database");
const bodyParser = require("body-parser");

router.use(express.json());
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

try {
  router.post("/login", async function (request, response) {
    const username = request.body.username;
    const password = request.body.password;
    const query = 'SELECT * FROM `users` WHERE `username` = ? AND `password` = ?';
    
    try {
      if (username && password) {
        const [rows, fields] = await database.execute(query, [username.username, password.password]);
        
        if (rows.length > 0) {
          return response.status(status.OK).json({ username: username });
        } else {
          return response
            .status(status.BAD_REQUEST)
            .json({ error: "Incorrect username or password" });
        }
      } else {
        return response
          .status(status.UNAUTHORIZED)
          .json({ error: "Please enter Username and Password!" });
      }
    } catch (error) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
    }
  });
} catch (error) {
  return response.status(status.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
}

module.exports = router;
