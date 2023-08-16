var express = require("express");
var router = express();

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
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";

    try {
      if (username && password) {
        const [rows, fields] = await database.query(query, [
          username,
          password,
        ]);

        if (rows.length > 0) {
          return response.status(200).json({ username: username });
        } else {
          return response
            .status(400)
            .json({ error: "Incorrect username or password" });
        }
      } else {
        return response
          .status(401)
          .json({ error: "Please enter Username and Password!" });
      }
    } catch (error) {
      return response.status(500).json({ error: "internal server error" });
    }
  });
} catch (error) {
  return response.status(500).json({ error: "internal server error" });
}

module.exports = router;
