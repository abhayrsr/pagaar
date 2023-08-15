var express = require("express");
var router = express();
var database = require("../database");

router.get("/transactions", function (request, response) {
  const userId = request.query.user_id;

  if (userId) {
    database.query(
      `select transaction_id, sender_id, receiver_id, status,transaction_date, amount from transactions where receiver_id = ? or sender_id = ?`,
      [userId, userId],
      function (error, results) {
        try {
          if (results.length > 0) {
            return response.status(200).json({ data: results });
          } else {
            return response.status(400).json({ error: "Incorrect user_id" });
          }
        } catch (error) {
          return response.status(500).json({ error: "Internal server error" });
        }
      }
    );
  } else {
    return response.status(401).json({ error: "Enter user_id" });
  }
});

module.exports = router;
