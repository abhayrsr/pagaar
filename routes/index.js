var express = require("express");
var router = express();
var status = require("http-status");

const database = require("../database");
const jwt = require('jsonwebtoken');
const secretKey = '10101010129299393939848'
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
    const query = 'SELECT * FROM `users` WHERE `username` = ? AND `password` = ?' ;
  
    try {
      
      if (username && password) {
        const [rows, fields] = await database.execute(query, [username, password]);
        
        if (rows.length > 0) {
          const query = 'SELECT balance FROM `wallet` WHERE `user_id` = ?' ;
          const[row, fields] = await database.execute(query,[rows[0].user_id]);
          const payload={
            username: username,
            balance: row[0].balance
          }
          const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
          return response.status(status.OK).json({ token });
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
