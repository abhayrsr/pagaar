var express = require("express");
var router = express();
var database = require("../database");
var status = require("http-status");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

try {
  router.get("/search", verifyToken, async function (request, response) {
    const username = request.query.username;
    const query = `select username, first_name, last_name, address from users where LOWER(username) LIKE '%${username}%'`;

    if (username) {
      try {
        const [rows, fields] = await database.query(query);

        if (rows.length > 0) {
          const userData = request.user;

          return response
            .status(status.OK)
            .json({ username: rows[0].username, user: userData });
        } else {
          return response
            .status(status.BAD_REQUEST)
            .json({ error: "Incorrect username" });
        }
      } catch (error) {
        return response
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal server error" });
      }
    } else {
      return response
        .status(status.UNAUTHORIZED)
        .json({ error: "Enter username" });
    }
  });
} catch (error) {
  return response
    .status(status.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal server error" });
}
module.exports = router;
