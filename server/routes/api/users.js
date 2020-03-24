const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  User.fetchAll().then(user => {
    res.status(200).json(user);
  });
});
router.get("/:username", (req, res) => {
  User.where({ username: req.params.username })
    .fetchAll()
    .then(user => {
      res.status(200).json(user);
    });
});

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

router.post("/new", (req, res) => {
  new User({
    username: req.body.username,
    password: req.body.password
  })
    .save()
    .then(newUser => {
      res.status(201).json({ newUser });
    });
});

router.put("/buysell/:username", (req, res) => {
  User.where({
    username: req.params.username
  })
    .fetch()
    .then(user => {
      console.log(user);
      user.save({
        username: user.username,
        password: user.password,
        signedUp: user.signedUp,
        cash: req.body.cash
      });
      res.status(200).json({ user });
    });
});

router.delete("/delete/:username", (req, res) => {
  User.where({ username: req.params.username })
    .destroy()
    .then(deletedUser => {
      res.status(200).json({ deletedUser });
    });
});

module.exports = router;
