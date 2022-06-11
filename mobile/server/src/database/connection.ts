import knex from "knex";
import Path from "path";

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: Path.resolve(__dirname, 'database.sqlite'),
  },
  useNullAsDefault:true,
});

export default db;