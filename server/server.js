const express = require("express");
const path = require("path");
const mysql = require("mysql");
const knex = require("./knexfile");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const stockRoute = require("./routes/api/stocks");
app.use("/stocks", stockRoute);
const userRoute = require("./routes/api/users");
app.use("/users", userRoute);
const orderRoute = require("./routes/api/orders");
app.use("/orders", orderRoute);

const PORT = process.env.PORT || 5000;

let connection;
// make connection
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection(knex.development);
}

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("../client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

connection.connect((err) => {
  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
