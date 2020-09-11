const bookshelf = require("../bookshelf");

const User = bookshelf.model("User", {
  tableName: "user",
  stocks: () => {
    return this.hasMany("stock");
  },
  orders: () => {
    return this.hasMany("order");
  },
});

module.exports = User;
