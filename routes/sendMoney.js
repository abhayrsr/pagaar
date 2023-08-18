var express = require("express");
var router = express();
var database = require("../database");
var status = require("http-status");

const bodyParser = require("body-parser");

router.use(express.json());
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

try {
  router.post("/sendmoney", async function (request, response) {
    const data = request.body;
    const query = `select balance from wallet where user_id = ?`;

    try {
      if (data.amount < 0) throw new Error("invalid amount");

      if (data.sender_id && data.receiver_id && data.amount) {
        const [rows, fields] = await database.query(query, [data.sender_id]);
        if (rows[0] === undefined) throw new Error("Incorrect sender_id");

        var balance = rows[0].balance;

        if (balance == undefined) throw new Error("Incorrect balance");

        const receiverQuery = `select user_id from wallet where user_id = ?`;
        const [receiver, field] = await database.query(receiverQuery, [
          data.receiver_id,
        ]);

        if (receiver[0] === undefined) throw new Error("Incorrect receiver_id");

        if (data.amount <= balance) {
          const senderBalanaceQuery = `update wallet set balance = ${balance} - ${data.amount} where user_id = ?`;
          const [senderBalance, fields1] = await database.query(
            senderBalanaceQuery,
            [data.sender_id]
          );

          const receiverBalanceQuery = `update wallet set balance = ${balance} + ${data.amount} where user_id = ?`;
          const [receiverBalance, fields2] = await database.query(
            receiverBalanceQuery,
            [data.receiver_id]
          );

          const senderTransactionQuery = `insert into transactions(sender_id, receiver_id, status, amount) values (${data.sender_id},${data.receiver_id},"sent",${data.amount});`;
          const [senderTransaction, field3] = await database.query(
            senderTransactionQuery
          );

          return response.status(status.OK).json({
            data: {
              transaction_id: senderTransaction.insertId,
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              status: "sent",
              amount: data.amount,
              balance: balance,
            },
          });
        } else if (data.amount > balance) {
          throw new Error("Insufficient balance");
        } else {
          return response
            .status(status.INTERNAL_SERVER_ERROR)
            .json({ error: "Internal server error" });
        }
      } else {
        return response
          .status(status.UNAUTHORIZED)
          .json({ error: "enter required credentials properly" });
      }
    } catch (errors) {
      return response
        .status(status.BAD_REQUEST)
        .json({ error: errors.message });
    }
  });
} catch (error) {
  return response
    .status(status.INTERNAL_SERVER_ERROR)
    .json({ error: "internal server error" });
}

module.exports = router;
