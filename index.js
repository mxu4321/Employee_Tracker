const inquirer = require("inquirer");
const database = require("./db.js");
const connection = require("./db/connection.js");
require("console.table");

const mainMenu = () => {
  // http://www.figlet.org/fonts/big.flf
  // http://www.figlet.org/fontdb_example.cgi?font=big.flf
  console.log(`============Employee🖇Tracker=============`);
  inquirer
    .prompt({
      name: "start",
      type: "list",
      message: "What would you like to do",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View All Departments",
        "Add Department",
        "Remove Department",
        "View Total Utilized Budget of a Department",
        "Exit",
      ],
    })
    .then((answer) => {
      // console.log(answer);
      switch (answer.start) {
        // --- ViewAllEmployees✅ ------
        case "View All Employees":
          ViewAllEmployees();
          break;

        // department: marketing, accounting, engineering, human resources, legal
        case "View All Employees By Department":
          database.ViewAllEmployeesByDepartment();

        // display a list includes all managers: first name, last name
        case "View All Employees By Manager":
          database.ViewAllEmployeesByManager();
          break;

        case "Add Employee":
          database.AddEmployee();
          break;

        case "Remove Employee":
          database.RemoveEmployee();
          break;

        case "Update Employee Role":
          database.UpdateEmployeeRole();
          break;

        case "Update Employee Manager":
          database.UpdateEmployeeManager();
          break;

        case "View All Roles":
          ViewAllRoles();
          break;

        case "Add Role":
          AddRole();
          break;

        case "Remove Role":
          RemoveRole();
          break;

        case "View All Departments":
          database.ViewAllDepartments();
          break;

        case "Add Department":
          database.AddDepartment();
          break;

        case "Remove Department":
          database.RemoveDepartment();
          break;

        case "View Total Utilized Budget of a Department":
          database.ViewTotalUtilizedBudgetOfADepartment();
          break;

        case "Exit":
          database.Exit();
          break;
      }
    });
};

// =============view all employees===========
function ViewAllEmployees() {
  // all ees: id, first name, last name, title, department, salary, manager
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
  // show result in the terminal by console.table
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

// ==========view all roles===========
function ViewAllRoles() {
  // all roles: id, title, salary, department
  // display all roles in terminal with console.table
  const query = `SELECT 
   role.id, 
   role.title, 
   role.salary, 
   department.name AS department 
   FROM role 
   LEFT JOIN department ON 
   role.department_id = department.id;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

// ==========add role===========
function AddRole() {
  // add role: title, salary, department
  const query = `SELECT department.name FROM department`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    // make a new array to store all department names
    const departments = data.map((item) => `${item.name}`);
    // --- new prompt to give hint for user's input needed
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          // display all department name as choices
          type: "list",
          name: "department_name",
          message: "What is the department of the role?",
          choices: [...departments],
        },
      ])
      .then((data) => {
        const { title, salary, department_name } = data;
        connection.query(
          `INSERT INTO role (title, salary, department_id)
             SELECT ?, ?, department.id
             FROM department
             WHERE department.name = ?`,
          [title, salary, department_name],
          (err, res) => {
            if (err) throw err;
            console.log(`\n-------------------\n Role ${title} has been added!\n`);
            ViewAllRoles(); 
          }
        );
      });
  });
}

// ==========remove role===========
function RemoveRole() {
  // prompt user to select role to remove
  // remove role: title, salary, department
  connection.query("SELECT role.title FROM role", (err, data) => {
    // console.log(data)
    const roles = data.map((item) => `${item.title}`);
    // console.log(roles);

    inquirer
      .prompt([
        {
          type: "list",
          name: "title",
          message: "Select a role you want to remove?",
          choices: [...roles],
        },
      ])
      .then((data) => {
        // console.log(data.title);
        const { title } = data;

        // Check if role exists. If not, display a message. If yes, delete the role.
        connection.query(
          "SELECT * FROM role WHERE title = '" + title + "'",
          (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
              console.log(`Role with title ${data.title} does not exist.`);
            }

            if (res.length !== 0) {
              connection.query(
                "DELETE FROM role WHERE title = '" + title + "'",
                (err, res) => {
                  if (err) throw err;
                  if (res.affectedRows === 0) {
                    console.log(
                      `Role with title ${data.title} does not exist.`
                    );
                  } else {
                    console.table({
                      message: `\n-------------------\n Role with title ${data.title} has been removed.\n`,
                      affectedRows: res.affectedRows,
                    });
                    ViewAllRoles();
                  }
                }
              );
            }
          }
        );
      });
  });
}

mainMenu();
