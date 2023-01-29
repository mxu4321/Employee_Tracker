// --- import dependencies ---
const mysql = require('mysql2');

// --- create the connection to database ---
const db = mysql.createConnection(
    { 
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_management_db'
    },
    console.log(`Connected to the employee management database.`)
);

module.exports = db;

