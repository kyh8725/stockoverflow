const express = require("express");
const router = express.Router();
const Stock = require("../../models/stock");

router.get("/allStocks", (req, res) => {
  Stock.fetchAll().then(stock => {
    res.status(200).json(stock);
  });
});

router.get("/:holder", (req, res) => {
  Stock.where({ holder: req.params.holder })
    .fetchAll()
    .then(stock => {
      res.status(200).json(stock);
    });
});

router.get("/:holder/:id", (req, res) => {
  Stock.where({ id: Number(req.params.id), holder: req.params.holder })
    .fetchAll()
    .then(stock => {
      res.status(200).json(stock);
    });
});

router.post("/buy", (req, res) => {
  new Stock({
    symbol: req.body.symbol,
    quantity: req.body.quantity,
    price: req.body.price,
    holder: req.body.holder,
    orderId: req.body.orderId
  })
    .save()
    .then(newStock => {
      res.status(201).json({ newStock });
    });
});

router.delete("/sell/:id", (req, res) => {
  Stock.where({
    id: req.params.id
  })
    .destroy()
    .then(soldStock => {
      res.status(200).json({ soldStock });
    });
});

module.exports = router;
