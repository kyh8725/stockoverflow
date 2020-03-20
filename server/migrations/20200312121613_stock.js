exports.up = function(knex) {
  return knex.schema.createTable("stock", table => {
    table.increments("id").primary();
    table.string("symbol").notNullable();
    table
      .integer("quantity")
      .unsigned()
      .notNullable();
    table
      .integer("price")
      .unsigned()
      .notNullable();
    table
      .string("holder")
      .notNullable()
      .references("username")
      .inTable("user")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("tradeDate").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("stock");
};
