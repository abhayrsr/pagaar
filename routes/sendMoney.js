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

    const senderQuery = `select user_id, balance from wallet where username = ?`;
    const [sendRows, sendFields] = await database.query(senderQuery, [data.senderName]);
    
    if(sendRows.length === 0){
      return response.status(status.BAD_REQUEST).json({ error: "Sender not found" });
    }

    const senderId = sendRows[0].user_id;
    const senderBalance = sendRows[0].balance;

    const receiverQuery = `select user_id, balance from wallet where username = ?`;
    const [receiverRows, receiveFields] = await database.query(receiverQuery, [data.receiverName]);

    if(receiverRows.length === 0){
      return response.status(status.BAD_REQUEST).json({ error: "Receiver not found" });
    }

    const receiverId = receiverRows[0].user_id;
    const receiverBalance = receiverRows[0].balance;

    try {
      if (data.amount < 0) throw new Error("Invalid amount");

      if(senderId == receiverId) throw new Error("Change receiver_id");
 
      if (senderId && receiverId && data.amount) {
       
        if (data.amount <= senderBalance) {
          const senderBalanaceQuery = `update wallet set balance = ${senderBalance} - ${data.amount} where user_id = ?`;
          const [senderLatestBalance, fields1] = await database.query(
            senderBalanaceQuery,
            [senderId]
          );

          const receiverBalanceQuery = `update wallet set balance = ${receiverBalance} + ${data.amount} where user_id = ?`;
          const [receiverLatestBalance, fields2] = await database.query(
            receiverBalanceQuery,
            [receiverId]
          );

          const senderTransactionQuery = `insert into transactions(sender_id, receiver_id, status, amount) values (${senderId},${receiverId},"sent",${data.amount});`;
          const [senderTransaction, field3] = await database.query(
            senderTransactionQuery
          );

          return response.status(status.OK).json({
            data: {
              transaction_id: senderTransaction.insertId,
              sender_name: data.senderName,
              receiver_name: data.receiverName,
              status: "sent",
              amount: data.amount,
              balance: senderBalance - data.amount,
            },
          });
        } else if (data.amount > senderBalance) {
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
