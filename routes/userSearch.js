var express = require("express");
var router = express();
var database = require("../database");
var status = require("http-status")

try {
  router.get("/search", async function (request, response) {
  const username = request.query.username;
  const query = `select username, first_name, last_name, address from users where LOWER(username) LIKE '%${username}%'`;

    if (username) {
      try {
        const [rows, fields] = await database.query(query);
        if (rows.length > 0) {
          return response.status(status.OK).json({ data: rows });
        } else {
          return response.status(status.BAD_REQUEST).json({ error: "Incorrect username" });
        }
      } catch (error) {
        return response.status(status.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
      }
    } else {
      return response.status(status.UNAUTHORIZED).json({ error: "Enter username" });
    }
});
} catch(error) {
  return response.status(status.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
}
module.exports = router;
