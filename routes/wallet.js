var express = require("express");
var router = express();
var database = require("../database");

try {
  router.get("/wallet", async function (request, response) {
    const walletId = request.query.wallet_id;
    const query = `select wallet_id, balance from wallet where wallet_id = ?`;

    if (walletId) {
      try {
        const [rows, fields] = await database.query(query, [walletId]);
        if (rows.length > 0) {
          return response.status(200).json({ data: rows });
        } else {
          return response.status(400).json({ error: "Incorrect wallet_id" });
        }
      } catch (error) {
        return response.status(500).json({ error: "Internal server error" });
      }
    } else {
      return response.status(401).json({ error: "Enter wallet_id" });
    }

  });
} catch (error) {
  return response.status(500).json({ error: "Internal server error" });
}

module.exports = router;
