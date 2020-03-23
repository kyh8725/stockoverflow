const express = require("express");
const router = express.Router();
const Order = require("../../models/order");

router.get("/:holder", (req, res) => {
  Order.where({ holder: req.params.holder })
    .fetchAll()
    .then(order => {
      res.status(200).json(order);
    });
});

router.post("/neworder", (req, res) => {
  new Order({
    symbol: req.body.symbol,
    quantity: req.body.quantity,
    price: req.body.price,
    holder: req.body.holder,
    buy: true
  })
    .save()
    .then(newOrder => {
      res.status(201).json({ newOrder });
    });
});

router.put("/orderset/:id", (req, res) => {
  Order.where({
    id: req.params.id
  })
    .fetch()
    .then(order => {
      order.save({
        id: order.id,
        price: order.price,
        quantity: order.quantity,
        holder: order.holder,
        buy: false
      });
      res.status(200).json({ order });
    });
});

module.exports = router;
