import Path from "path";

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: Path.resolve(__dirname, 'src','database', 'database.sqlite')
  },
  migrations: {
    directory: Path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  useNullAsDefault: true,
};