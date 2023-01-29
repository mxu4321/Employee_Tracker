const connection = require("./db/connection.js");
require("console.table");
const inquirer = require("inquirer");
// const mysql = require("mysql2");

class Database {
  constructor(connection) {
    this.connection = connection;
  };

  ViewAllEmployees() {
    // all ees: id, first name, last name, title, department, salary, manager
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
    // show result in the terminal by console.table
    connection.query(query, (data) => {
      console.table(data);
    });
  };

    ViewAllEmployeesByDepartment() {
    // department: marketing, accounting, engineering, human resources, legal
    // -- another inquire prompt needed for department selection display
    // display ee by department, with id, first name, last name, title
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY department.name;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    ViewAllEmployeesByManager() {
    // display a list includes all managers: first name, last name
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY manager;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    AddEmployee() {
    // add ee: first name, last name, role, manager
    // --- ee array needed, for user to add on to
    // --- new prompt to give hint for user's input needed
    const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    RemoveEmployee() {
    // remove ee: first name, last name, role, manager
    const query = `DELETE FROM employee WHERE id = ?;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    UpdateEmployeeRole() {
    // update ee role: first name, last name, role, manager
    const query = `UPDATE employee SET role_id = ? WHERE id = ?;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    UpdateEmployeeManager() {
    // update ee manager: first name, last name, role, manager
    const query = `UPDATE employee SET manager_id = ? WHERE id = ?;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    ViewAllRoles() {
    // all roles: id, title, salary, department
    const query = `SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;`;
    connection.query(query, (data) => {
        console.table(data);
        }
    );
    };

    AddRole() {
    // add role: title, salary, department
    // --- role array needed, for user to add on to
    // --- new prompt to give hint for user's input needed
    inquirer.prompt([
        {
            // type: "input",
            name: "title",
            message: "What is the title of the role?",
        },
        {
            // type: "input",
            name: "salary",
            message: "What is the salary of the role?",
        },
        {
            // type: "input",
            name: "department_id",
            message: "What is the department id of the role?",
        },
    ]).then((data) => {
        console.log("line 108" + data);
        const {title, salary, department_id} = data;
        this.connection.query(`INSERT INTO role SET  ?, ?, ?`, {title, salary, department_id}, (err, res) => {
            if (err) throw err;
            console.table(res);
            }) 
    });
    };

    RemoveRole() {
    // remove role: title, salary, department
    const query = `DELETE FROM role WHERE id = ?;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    ViewAllDepartments() {
    // all departments: id, name
    const query = `SELECT department.id, department.name FROM department;`;
        // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    AddDepartment() {
    // add department: name
    // --- department array needed, for user to add on to
    // --- new prompt to give hint for user's input needed
    const query = `INSERT INTO department (name) VALUES (?);`;
        // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    RemoveDepartment() {
    // remove department: name
    const query = `DELETE FROM department WHERE id = ?;`;
        // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };

    ViewTotalUtilizedBudgetByDepartment() {
    // total budget: department, sum of salaries
    const query = `SELECT department.name AS department, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id GROUP BY department.name;`;
        // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
    };
};

const database = new Database();
database.AddRole();

module.exports = Database;
