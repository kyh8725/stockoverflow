const bookshelf = require("../bookshelf");

const Stock = bookshelf.model("Stock", {
  tableName: "stock",
  user: () => {
    return this.belongsTo("user");
  }
});

module.exports = Stock;
