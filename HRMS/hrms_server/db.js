import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Malorm_.1",
  database: "hrms",
});

const db = connection.promise();
export default db;
