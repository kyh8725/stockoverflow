const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  User.fetchAll().then((user) => {
    res.status(200).json(user);
  });
});

router.get("/:username", async (req, res) => {
  await User.where({ username: req.params.username })
    .fetchAll()
    .then((user) => {
      res.status(200).json(user);
    });
});

router.post("/login", async (req, res) => {
  const JWT_SECRET_KEY = process.env.REACT_APP_JWT_SECRET_KEY;
  const username = req.body.username;

  await User.fetchAll().then(async (user) => {
    const userObj = JSON.parse(JSON.stringify(user));
    const userFound = userObj.filter((user) => user.username === username);
    const validPass = await bcrypt.compare(
      req.body.password,
      userFound[0].password
    );
    if (validPass) {
      const token = jwt.sign(
        {
          user: userFound[0].username,
        },
        JWT_SECRET_KEY
      );
      res.header("auth-token", token).send(userFound[0].username);
    } else {
      res.status(401).send("incorrect password");
    }
  });
});

router.post("/new", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  try {
    await new User({
      username: req.body.username,
      password: hashPassword,
    })
      .save()
      .then((newUser) => {
        res.status(201).json({ newUser });
      });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/trade/sell", async (req, res) => {
  try {
    await new User()
      .where({ username: req.body.username })
      .save({ cash: Number(req.body.cash) }, { patch: true })
      .then((user) => {
        res.status(200).json({ user });
      });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/delete/:username", async (req, res) => {
  await User.where({ username: req.params.username })
    .destroy()
    .then(() => {
      res.status(200).json(req.body.username);
    });
});

module.exports = router;
