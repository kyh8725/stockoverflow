const userData = require("../seed_data/userSeed");
const stockData = require("../seed_data/stockSeed");
const orderData = require("../seed_data/orderSeed");
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user").insert(userData);
    })
    .then(() => {
      return knex("stock").insert(stockData);
    })
    .then(() => {
      return knex("order").insert(orderData);
    });
};
