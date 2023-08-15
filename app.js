const express = require("express");
const router = require("./routes/index");
const app = express();
const port = 3000;

var indexRouter = require("./routes/index");
var walletRouter = require("./routes/wallet");
var transactionRouter = require("./routes/transaction");
var userSearchRouter = require("./routes/userSearch");
var sendMoneyRouter = require("./routes/sendMoney");

app.use("/users", indexRouter);
app.use("/users", walletRouter);
app.use("/users", transactionRouter);
app.use("/users", userSearchRouter);
app.use("/users", sendMoneyRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
