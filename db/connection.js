const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kn3p1c3b$3q!",
  database: "employees"
});

module.exports = db;