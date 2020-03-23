const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
const stockRoute = require("./routes/api/stocks");
app.use("/stocks", stockRoute);
const userRoute = require("./routes/api/users");
app.use("/users", userRoute);
const orderRoute = require("./routes/api/orders");
app.use("/orders", orderRoute);

const port = 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
