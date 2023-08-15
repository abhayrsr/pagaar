var express = require("express");
var router = express();
var database = require("../database");

router.get("/wallet", function (request, response) {
  const walletId = request.query.wallet_id;

  if (walletId) {
    database.query(
      `select wallet_id, balance from wallet where wallet_id = ?`,
      [walletId],
      function (error, results) {
        try {
          if (results.length > 0) {
            return response.status(200).json({ data: results });
          } else {
            return response.status(400).json({ error: "Incorrect wallet_id" });
          }
        } catch (error) {
          return response.status(500).json({ error: "Internal server error" });
        }
      }
    );
  } else {
    return response.status(401).json({ error: "Enter wallet_id" });
  }
});

module.exports = router;
