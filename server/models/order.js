const bookshelf = require("../bookshelf");

const Stock = bookshelf.model("Order", {
  tableName: "order",
  user: () => {
    return this.belongsTo("user");
  }
});

module.exports = Stock;
