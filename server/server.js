const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
const stockRoute = require("./routes/api/stocks");
app.use("/", stockRoute);

const port = 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
