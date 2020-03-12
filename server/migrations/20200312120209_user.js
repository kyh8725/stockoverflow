exports.up = knex => {
  return knex.schema.createTable("user", table => {
    table
      .string("username")
      .notNullable()
      .primary();
    table.string("password").notNullable();
    table.timestamp("signedUp").defaultTo(knex.fn.now());
    table
      .integer("balance")
      .unsigned()
      .defaultTo(10000);
  });
};

exports.down = knex => {
  return knex.schema.dropTable("user");
};
