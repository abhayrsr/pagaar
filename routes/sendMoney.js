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

router.post("/sendmoney", async function (request, response) {
  const data = await request.body;

  if (data.sender_id && data.receiver_id) {
    database.query(
      "select balance from wallet where user_id = ?",
      [data.sender_id],
      function (err, results) {
        var balance = results[0].balance;

        database.query(
          "select transaction_id, sender_id, receiver_id, transaction_date, status from transactions where sender_id = ? and receiver_id = ?",
          [data.sender_id, data.receiver_id],
          function (error, results) {
            try {
              if (results.length > 0) {
                if (data.amount < balance) {
                  database.query(
                    `update wallet set balance = ${balance} - ${data.amount} where user_id = ?`,
                    [data.sender_id]
                  );
                  database.query(
                    `update wallet set balance = ${balance} + ${data.amount} where user_id = ?`,
                    [data.receiver_id]
                  );
                  database.query(
                    `insert into transactions(sender_id, receiver_id, status, amount) values (?, ?, ?, ?)`,
                    [data.sender_id, data.receiver_id, "sent", data.amount]
                  );

                  return response.status(200).json({ data: results });
                } else {
                  return response.send("Insufficient balance");
                }
              } else {
                return response
                  .status(400)
                  .json({ error: "Incorrect details" });
              }
            } catch (error) {
              return response
                .status(500)
                .json({ error: "Internal server error" });
            }
          }
        );
      }
    );
  } else {
    return response
      .status(401)
      .json({ error: "enter required credentials properly" });
  }
});

module.exports = router;
