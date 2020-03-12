const express = require("express");
const router = express.Router();
const User = require("../../models/user");

// router.post("/signup", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
// });

router.get("/users/", (req, res) => {
  User.fetchAll().then(user => {
    const userObj = JSON.parse(JSON.stringify(user));
    const userNames = userObj.map(user => {
      return user.username;
    });
    console.log(userNames);
    res.status(200).json(userNames);
  });
});

router.get("/", (req, res) => {
  User.fetchAll().then(user => {
    res.status(200).json(user);
  });
});

// const JWT_SECRET_KEY = "BrainStation";

// router.get("/private", (req, res) => {
//   const token = req.headers.authorization.split(" ")[1];
//   jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
//     if (err) {
//       res.status(403).send("Invalid Token");
//     } else {
//       res.send(decoded);
//     }
//   });
// });

module.exports = router;
