const inquirer = require("inquirer");
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
        "View All Employees", // ✅
        "View All Employees By Department", // ✅
        "View All Employees By Manager", // ✅
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles", // ✅
        "Add Role", // ✅
        "Remove Role", // ✅
        "View All Departments", // ✅
        "Add Department", // ✅
        "Remove Department", // ✅
        "View Total Utilized Budget of a Department", // ✅
        "Exit", // ✅
      ],
    })
    .then((answer) => {
      // console.log(answer);
      switch (answer.start) {
        // --- ViewAllEmployees✅ ------
        case "View All Employees":
          ViewAllEmployees();
          break;

        // --- ViewAllEmployeesByDepartment✅ ------
        case "View All Employees By Department":
          ViewAllEmployeesByDepartment();
          break;

        // --- ViewAllEmployeesByManager✅ ----
        case "View All Employees By Manager":
          ViewAllEmployeesByManager();
          break;

        case "Add Employee":
          AddEmployee();
          break;

        case "Remove Employee":
          RemoveEmployee();
          break;

        case "Update Employee Role":
          UpdateEmployeeRole();
          break;

        case "Update Employee Manager":
          UpdateEmployeeManager();
          break;

        // --- ViewAllRoles✅ ----
        case "View All Roles":
          ViewAllRoles();
          break;

        // --- AddRole✅ ----
        case "Add Role":
          AddRole();
          break;

        // --- RemoveRole✅ ----
        case "Remove Role":
          RemoveRole();
          break;

        // --- ViewAllDepartments✅ ----
        case "View All Departments":
          ViewAllDepartments();
          break;

        // --- AddDepartment✅ ----
        case "Add Department":
          AddDepartment();
          break;

        // --- RemoveDepartment✅ ----
        case "Remove Department":
          RemoveDepartment();
          break;

        // --- ViewTotalUtilizedBudgetByDepartment✅ ----
        case "View Total Utilized Budget of a Department":
          ViewTotalUtilizedBudgetByDepartment();
          break;

        // --- Exit✅ ----
        case "Exit":
          Exit();
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

// =============view all employees by department===========
function ViewAllEmployeesByDepartment() {
  // department: marketing, accounting, engineering, human resources, legal
  // -- another inquire prompt needed for department selection display
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Which department would you like to view?",
      choices: [
        "Marketing",
        "Accounting",
        "Engineering",
        "Human Resources",
        "Legal",
      ],
    })
    .then((answer) => {
      // console.log(answer);
      switch (answer.department) {
        case "Marketing":
          return myViewEmployeesByDepartment("Marketing");
        case "Accounting":
          return myViewEmployeesByDepartment("Accounting");
        case "Engineering":
          return myViewEmployeesByDepartment("Engineering");
        case "Human Resources":
          return myViewEmployeesByDepartment("Human Resources");
        case "Legal":
          return myViewEmployeesByDepartment("Legal");
      }
    });
  // display ee by department, with id, first name, last name, title
  function myViewEmployeesByDepartment(department) {
    const query = `
     SELECT employee.id, 
     employee.first_name, 
     employee.last_name, 
     role.title, 
     department.name AS department 
     FROM employee 
     LEFT JOIN role ON employee.role_id = role.id 
     LEFT JOIN department ON role.department_id = department.id 
     WHERE department.name = ?;`;
    connection.query(query, department, (err, data) => {
      if (err) throw err;
      console.table(data);
      mainMenu();
    });
  }
}

// =============view all employees by manager===========
function ViewAllEmployeesByManager() {
  // display a list includes all managers: first name, last name
  const query = `SELECT 
   employee.id, 
   employee.first_name, 
   employee.last_name, 
   role.title, 
   department.name AS 
   department, 
   CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
   FROM employee 
   LEFT JOIN role ON employee.role_id = role.id 
   LEFT JOIN department ON role.department_id = department.id 
   LEFT JOIN employee manager ON manager.id = employee.manager_id 
   ORDER BY manager;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

function myFunction() {
  const query2 = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;`;
  connection.query(query2, (err, data) => {
    if (err) throw err;
    console.log("@@@", data);
    // make a new array to store all manager names
    const managers = data.map((item) => `${item.first_name} ${item.last_name}`);

    return managers;
  });
}
// =============⚠️add employee⚠️===========
function AddEmployee() {
  // display a list as choice includes all roles

  const query1 = `SELECT title FROM role;`;

  connection.query(query1, (err, data) => {
    if (err) throw err;
    // make a new array to store all role titles
    const roles = data.map((item) => `${item.title}`);

    //display a list as choice includes all managers

    // add ee: first name, last name, role, manager
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "role",
          type: "list",
          message: "What is the employee's role?",
          choices: roles,
        },
      ])
      .then((answer) => {
        console.log("answer1",answer);
        const query2 = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;`;
        connection.query(query2, (err, data) => {
          if (err) throw err;
          console.log("@@@", data);
          // make a new array to store all manager names
          const managers = data.map(
            (item) => `${item.first_name} ${item.last_name}`
          );

          inquirer.prompt([
            {
              name: "manager",
              type: "list",
              message: "Who is the employee's manager?",
              choices: [...managers, "None"], // shows undefined and none
            },
          ]);
        });
      })
      .then((answer) => {
        console.log("answer2", answer);
        // add ee to db based on user input
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        connection.query(
          query,
          [answer.first_name, answer.last_name, answer.role, answer.manager],
          (err, data) => {
            if (err) throw err;
            console.table(data);
            mainMenu();
          }
        );
      });
  });
}

// ⚠️============ TODO: remove employee: NOT removed===========
function RemoveEmployee() {
  // remove ee: first name, last name, role, manager
  // --- ee array needed, for user to remove from
  // --- new prompt to give hint for user's input needed
  const query = `SELECT 
  employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.name AS 
  department, 
  role.salary, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS 
  manager FROM 
  employee LEFT JOIN role ON 
  employee.role_id = role.id 
  LEFT JOIN department ON 
  role.department_id = department.id LEFT JOIN 
  employee manager ON 
  manager.id = employee.manager_id;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    const employees = data.map(
      (item) => `${item.first_name} ${item.last_name}`
    );
    inquirer
      .prompt({
        name: "employee",
        type: "list",
        message: "Which employee would you like to remove?",
        choices: [...employees],
      })
      .then((answer) => {
        // delete ee from db based on user input
        const query = `DELETE FROM employee WHERE first_name = ? AND last_name = ?`;
        console.table(`You have removed ${answer.employee} from the database.`);
        ViewAllEmployees();
      });
  });
}

// ⚠️========== TODO: update employee role ==========
function UpdateEmployeeRole() {
  // update ee role: first name, last name, role, manager
  // --- select all ee from table and map to an array, for user to update from
  const queryEE = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
  connection.query(queryEE, (err, data) => {
    if (err) throw err;
    // make a new array to store all ee names
    const employees = data.map(
      (item) => `${item.first_name} ${item.last_name}`
    );
    // --- new prompt to give hint for user's input needed
    inquirer.prompt({
      name: "employee",
      type: "list",
      message: "Which employee would you like to update?",
      choices: employees,
    });
  });
}

// ⚠️========== TODO: update employee manager ==========
function UpdateEmployeeManager() {
  // updated ee manager: first name, last name, role, department, salary
  // --- select all managers from ee table and map to an array, for user to update from
  const queryManager = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;`;
  connection
    .query(queryManager, (err, data) => {
      if (err) throw err;
      // make a new array to store all manager names
      const managers = data.map(
        (item) => `${item.first_name} ${item.last_name}`
      );
      // --- new prompt to give hint for user's input needed
      inquirer.prompt({
        name: "manager",
        type: "list",
        message: "Which manager would you like to update?",
        choices: managers,
      });
    })
    .then((answer) => {
      // console.log(answer);
      switch (answer.manager) {
        case "Marketing":
          return myViewEmployeesByDepartment("Marketing");
        case "Accounting":
          return myViewEmployeesByDepartment("Accounting");
        case "Engineering":
          return myViewEmployeesByDepartment("Engineering");
        case "Human Resources":
          return myViewEmployeesByDepartment("Human Resources");
        case "Legal":
          return myViewEmployeesByDepartment("Legal");
      }
    });

  function myViewEmployeesByDepartment(department) {}
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
            console.log(
              `\n-------------------\n Role ${title} has been added!\n`
            );
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

// ========= view all departments ==========
function ViewAllDepartments() {
  // all departments: id, name
  const query = `SELECT 
  department.id, 
  department.name FROM 
  department;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

// ========= add department ==========
function AddDepartment() {
  // add department: name
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?",
      },
    ])
    .then((data) => {
      const { name } = data;
      connection.query(
        `INSERT INTO department (name) VALUES (?)`,
        [name],
        (err, res) => {
          if (err) throw err;
          console.log(
            `\n-------------------\n Department ${name} has been added!\n`
          );
          ViewAllDepartments();
        }
      );
    });
}

// ========= remove department ==========
function RemoveDepartment() {
  // remove department: name
  // prompt user to select department to remove
  connection.query("SELECT department.name FROM department", (err, data) => {
    // make a new array to store all department names
    const departments = data.map((item) => `${item.name}`);
    // --- new prompt to give hint for user's input needed
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Select a department you want to remove?",
          choices: [...departments],
        },
      ])
      .then((data) => {
        const { name } = data;

        // Check if department exists. If not, display a message. If yes, delete the department.
        connection.query(
          "SELECT * FROM department WHERE name = '" + name + "'",
          (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
              console.log(`Department with name ${data.name} does not exist.`);
            }

            if (res.length !== 0) {
              connection.query(
                "DELETE FROM department WHERE name = '" + name + "'",
                (err, res) => {
                  if (err) throw err;
                  if (res.affectedRows === 0) {
                    console.log(
                      `Department with name ${data.name} does not exist.`
                    );
                  } else {
                    console.table({
                      message: `\n-------------------\n Department with name ${data.name} has been removed.\n`,
                      affectedRows: res.affectedRows,
                    });
                    ViewAllDepartments();
                  }
                }
              );
            }
          }
        );
      });
  });
}

// ============ total utilized budget of a department ===========
function ViewTotalUtilizedBudgetByDepartment() {
  // total budget: department, sum of salaries
  const query = `SELECT department.name AS department, 
   SUM(role.salary) AS utilized_budget FROM employee 
   LEFT JOIN role ON employee.role_id = role.id 
   LEFT JOIN department ON role.department_id = department.id 
   GROUP BY department.name;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

// ===== Exit the application =====
function Exit() {
  console.log("Goodbye!");
  connection.end();
}

mainMenu();
