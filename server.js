// --- import dependencies ---
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// --- create the connection to database ---
const db = mysql.createConnection(
    { 
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'employee_management_db'
    },
    console.log(`Connected to the employees database.`)
);

// --- prompt user for what they would like to do ---