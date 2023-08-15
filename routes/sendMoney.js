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

  if (data.sender_id && data.receiver_id && data.amount) {
    database.query(
      "select balance from wallet where user_id = ?",
      [data.sender_id],
      function (err, results) {
        try {
          var balance = results[0].balance;
        } catch (error) {
          return response.send("invalid sender id");
        }

        if (data.amount < balance) {
          database.query(
            `update transactions set amount = ${data.amount} where sender_id = ? and receiver_id = ?`,
            [data.sender_id, data.receiver_id]
          );
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

          database.query(
            `select transactions.transaction_id, transactions.sender_id, transactions.receiver_id, transactions.transaction_date, transactions.status, transactions.amount, wallet.balance from transactions inner join wallet on transactions.sender_id = wallet.user_id where sender_id = ${data.sender_id}`,

            function (error, results) {
              try {
                if (results.length > 0) {
                  return response.status(200).json({ data: results });
                }
              } catch (error) {
                return response
                  .status(400)
                  .json({ error: "Incorrect details" });
              }
            }
          );
        } else if (data.amount > balance) {
          return response.send("Insufficient balance");
        } else {
          return response.status(500).json({ error: "Internal server error" });
        }
      }
    );
  } else {
    return response
      .status(401)
      .json({ error: "enter required credentials properly" });
  }
});

module.exports = router;
