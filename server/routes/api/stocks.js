const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Stock = require("../../models/stock");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  JWT_SECRET_KEY = "StockOverflow";
  const username = req.body.username;
  const password = req.body.password;
  User.fetchAll().then(user => {
    const userObj = JSON.parse(JSON.stringify(user));
    const userFound = userObj.filter(user => user.username === username);
    if (userFound[0].password === password) {
      jwt.sign(
        {
          name: userFound[0].username
        },
        JWT_SECRET_KEY,
        (err, token) => {
          res.json({ token: token });
        }
      );
    } else {
      res.status(401).json("incorrect password");
    }
    res.status(200).json(token);
  });
});

router.get("/users/", (req, res) => {
  User.fetchAll().then(user => {
    res.status(200).json(user);
  });
});

router.get("/stocks/", (req, res) => {
  Stock.where(req.query)
    .fetchAll()
    .then(stock => {
      res.status(200).json(stock);
    });
});

router.get("/stocks/:username", (req, res) => {
  Stock.where(req.params.username)
    .fetch()
    .then(stock => {
      res.status(200).json(stock);
    });
});

module.exports = router;
