const userData = require("../seed_data/userSeed");
const stockData = require("../seed_data/stockSeed");
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("user").insert(userData);
    })
    .then(() => {
      return knex("stock").insert(stockData);
    });
};
