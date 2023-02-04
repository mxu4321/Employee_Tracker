const connection = require("./db/connection.js");
require("console.table");
const inquirer = require("inquirer");
// const mysql = require("mysql2");

class Database {
  constructor(connection) {
    this.connection = connection;
  }

  // -------- ⚠️ to be checked ⚠️ --------
  ViewAllEmployees() {
    // all ees: id, first name, last name, title, department, salary, manager
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
    // show result in the terminal by console.table
    connection.query(query, (data) => {
      console.table(data);
    });
  }
  // ---------AddRole()✅------------
  ViewAllEmployeesByDepartment() {
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
      });
    }
  }

  // ⚠️ TypeError: Cannot convert undefined or null to object
  ViewAllEmployeesByManager() {
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
    connection.query(query, (data) => {
      console.table(data);
    });
  }

  // ⚠️ throw new Error('You must provide a `' + name + '` parameter');
  AddEmployee() {
    // add ee: first name, last name, role, manager
    // --- ee array needed, for user to add on to
    // --- new prompt to give hint for user's input needed
    const managers = displayManager();
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the first name of the employee?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the last name of the employee?",
        },
        {
          type: "input",
          name: "role_id",
          message: "What is the role of the employee?",
        },
        {
          type: "list",
          name: "manager_id",
          message: "Who is the manager of the employee?",
          //  ⚠️ Error: You must provide a `choices` parameter
          choices: managers,
        },
      ])
      .then((answer) => {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
        connection.query(query, (err, data) => {
          if (err) throw err;
          console.table(data);
        });
      });

    function displayManager() {
      const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, manager.id
      FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY manager;`;
      connection.query(query, (err, results) => {
        if (err) throw err;
        return results;
      });
    }
  }

  RemoveEmployee() {
    // remove ee: first name, last name, role, manager
    // --- ee array needed, for user to remove from
    // --- new prompt to give hint for user's input needed
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
    inquirer
  .prompt({
    name: "employee",
    type: "list",
    message: "Which employee would you like to remove?",
    choices: function() {
      return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.map(result => `${result.first_name} ${result.last_name}`));
        });
      });
    }
  })
      // .then((answer) => {
      //   // console.log(answer);
      //   switch (answer.employee) {
      //     case "Marketing":
      //       return myViewEmployeesByDepartment("Marketing");
      //     case "Accounting":
      //       return myViewEmployeesByDepartment("Accounting");
      //     case "Engineering":
      //       return myViewEmployeesByDepartment("Engineering");
      //     case "Human Resources":
      //       return myViewEmployeesByDepartment("Human Resources");
      //     case "Legal":
      //       return myViewEmployeesByDepartment("Legal");
      //   }
      // });

    // function myViewEmployeesByDepartment(department) {
    //   const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    //                 FROM employee 
    //                 LEFT JOIN role ON employee.role_id = role.id 
    //                 LEFT JOIN department ON role.department_id = department.id 
    //                 LEFT JOIN employee manager ON manager.id = employee.manager_id
    //                 WHERE department.name = ?;`;
    //   connection.query(query, [department], (error, results) => {
    //     if (error) {
    //       console.error(error);
    //       return;
    //     }
    //     console.table(results);
    //   });
    // }
  }

  UpdateEmployeeRole() {
    // update ee role: first name, last name, role, manager
    const query = `UPDATE employee SET role_id = ? WHERE id = ?;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
  }

  UpdateEmployeeManager() {
    // update ee manager: first name, last name, role, manager
    const query = `UPDATE employee SET manager_id = ? WHERE id = ?;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
  }

  ViewAllRoles() {
    // all roles: id, title, salary, department
    const query = `SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;`;
    connection.query(query, (data) => {
      console.table(data);
    });
  }

  // ---------AddRole()✅------------
  AddRole() {
    // add role: title, salary, department
    // --- role array needed, for user to add on to
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
          type: "list",
          name: "department_id",
          message: "What is the department id of the role?",
          choices: [1, 2, 3, 4, 5],
        },
      ])
      .then((data) => {
        const { title, salary, department_id } = data;
        // console.log("line 108", title, salary, department_id);
        this.connection.query(
          "INSERT INTO role SET `title` = '" +
            title +
            "', `salary` = '" +
            salary +
            "', `department_id` = '" +
            department_id +
            "'",
          (err, res) => {
            if (err) throw err;
            console.table(res);
          }
        );
      });
  }

  RemoveRole() {
    // remove role: title, salary, department
    const query = `DELETE FROM role WHERE id = ?;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
  }

  ViewAllDepartments() {
    // all departments: id, name
    const query = `SELECT department.id, department.name FROM department;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
  }

  AddDepartment() {
    // add department: name
    // --- department array needed, for user to add on to
    // --- new prompt to give hint for user's input needed
    const query = `INSERT INTO department (name) VALUES (?);`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
  }

  RemoveDepartment() {
    // remove department: name
    const query = `DELETE FROM department WHERE id = ?;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
  }

  ViewTotalUtilizedBudgetByDepartment() {
    // total budget: department, sum of salaries
    const query = `SELECT department.name AS department, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id GROUP BY department.name;`;
    // connection.query(query, (data) => {
    //     console.table(data);
    //     }
    // );
  }
}

// ------check for methods in Database class------
const database = new Database(connection);
// database.ViewAllEmployees(); not working: TypeError: Cannot convert undefined or null to object
// database.ViewAllEmployeesByDepartment(); // ✅
// database.ViewAllEmployeesByManager(); // ✅
// database.AddEmployee(); // Error: You must provide a `choices` parameter
database.RemoveEmployee();

// database.AddRole();

module.exports = Database;
