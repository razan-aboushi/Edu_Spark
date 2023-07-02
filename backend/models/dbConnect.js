// create connection to mysql
const mysql = require("mysql2");

const connection = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'razan1234',
    database: 'edu_spark',
  });
  
  // Check if the database connection is successful
  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database!');
    connection.release();
  });
  
  

 module.exports=connection; 