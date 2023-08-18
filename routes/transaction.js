var express = require("express");
var router = express();
var database = require("../database");
var status = require("http-status")

try {
  router.get("/transactions", async function (request, response) {
    const userId = request.query.user_id;
    const query = `select transaction_id, sender_id, receiver_id, status,transaction_date, amount from transactions where receiver_id = ? or sender_id = ?`;

    if (userId) {
      try {
        const [rows, fields] = await database.query(query, [userId, userId]);

        if (rows.length > 0) {
          return response.status(status.OK).json({ data: rows });
        } else {
          return response.status(status.BAD_REQUEST).json({ error: "Incorrect user_id" });
        }
      } catch (error) {
        return response.status(status.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
      }
    } else {
      return response.status(status.UNAUTHORIZED).json({ error: "Enter user_id" });
    }
  });
} catch (error) {
  return response.status(status.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
}

module.exports = router;
