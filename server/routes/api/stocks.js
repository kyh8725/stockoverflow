const express = require("express");
const router = express.Router();
const Stock = require("../../models/stock");

router.get("/", (req, res) => {
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

router.post("/buy", (req, res) => {
  new Stock({
    symbol: req.body.symbol,
    quantity: req.body.quantity,
    price: req.body.price,
    holder: req.body.holder
  })
    .save()
    .then(newStock => {
      res.status(201).json({ newStock });
    });
});

router.delete("/sell", (req, res) => {
  Stock.where({ symbol: req.body.symbol, holder: req.body.holder })
    .destroy()
    .then(soldStock => {
      res.status(200).json({ soldStock });
    });
});

module.exports = router;
