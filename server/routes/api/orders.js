const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const verify = require("./verifyToken");

router.get("/:holder", (req, res) => {
  Order.where({ holder: req.params.holder })
    .fetchAll()
    .then((order) => {
      res.status(200).json(order);
    });
});

router.post("/buyOrder", (req, res) => {
  new Order({
    symbol: req.body.symbol,
    quantity: req.body.quantity,
    price: req.body.price,
    holder: req.body.holder,
    buy: true,
    sell: false,
  })
    .save()
    .then((newOrder) => {
      res.status(201).json({ newOrder });
    });
});

router.post("/sellOrder", (req, res) => {
  new Order({
    symbol: req.body.symbol,
    quantity: req.body.quantity,
    price: req.body.price,
    holder: req.body.holder,
    stockId: req.body.stockId,
    buy: false,
    sell: true,
  })
    .save()
    .then((newOrder) => {
      res.status(201).json({ newOrder });
    });
});

router.put("/settle/:id", (req, res) => {
  try {
    Order.where({
      id: req.params.id,
    })
      .fetch()
      .then((order) => {
        order.save({
          id: order.id,
          price: order.price,
          quantity: order.quantity,
          holder: order.holder,
          buy: false,
          sell: false,
        });
        res.status(200).json({ order });
      });
  } catch (err) {
    res.status(401).send(err);
  }
});

module.exports = router;
