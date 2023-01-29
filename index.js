const inquirer = require("inquirer");
const database = require("./db.js");
// const db = require("./db/connection.js");

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
      case "View All Employees":
        return myViewEmployees();
         //database.ViewAllEmployees();

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
         database.ViewAllRoles();
         break;

      case "Add Role":
         database.AddRole();
         break;

      case "Remove Role":
         database.RemoveRole();
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

function myViewEmployees() {
    inquirer.prompt(

    ).then(answer =>{

        database.ViewAllEmployees();
    })
  
}



mainMenu();
