const express = require("express");
const router = require("./routes/index");
const app = express();
const port = 3000;

var indexRouter = require("./routes/index");
var walletRouter = require("./routes/wallet");

app.use("/users", indexRouter);
app.use("/users", walletRouter);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
