exports.up = function(knex) {
  return knex.schema.createTable("order", table => {
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
      .boolean("buy")
      .notNullable()
      .defaultTo(true);
    table
      .boolean("sell")
      .notNullable()
      .defaultTo(true);
    table
      .string("holder")
      .notNullable()
      .references("username")
      .inTable("user")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("orderDate").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("order");
};
