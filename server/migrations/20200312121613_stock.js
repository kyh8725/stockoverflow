exports.up = function(knex) {
  return knex.schema.createTable("stock", table => {
    table.increments("id").primary();
    table.string("symbol").notNullable();
    table
      .integer("quantity")
      .unsigned()
      .notNullable();
    table
      .decimal("price", 10, 2)
      .unsigned()
      .notNullable();
    table
      .string("holder")
      .notNullable()
      .references("username")
      .inTable("user")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("orderId")
      .notNullable()
      .defaultTo(0);
    table.timestamp("tradeDate").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("stock");
};
