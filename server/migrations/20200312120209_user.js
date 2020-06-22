exports.up = knex => {
  return knex.schema.createTable("user", table => {
    table.string("username").primary();
    table
      .string("password")
      .notNullable()
      .defaultTo("1234");
    table.timestamp("signedUp").defaultTo(knex.fn.now());
    table.decimal("cash", 10, 2).defaultTo(100000.0);
  });
};

exports.down = knex => {
  return knex.schema.dropTable("user");
};
