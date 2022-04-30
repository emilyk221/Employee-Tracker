const db = require("./db/connection");
const {viewAllDepartments, addDepartment, viewRoles, viewEmployees} = require("./db/index.js");
const inquirer = require("inquirer");
const table = require("console.table");

const mainMenuPrompt = {
  type: "list",
  name: "menu",
  message: "What would you like to do?",
  choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"],
  default: 0
};

const mainMenu = () => {
  return inquirer.prompt(mainMenuPrompt)
  .then(menuResponse => {
    if (menuResponse.menu === "View all departments") {
      // return table listing all departments
      viewAllDepartments().then((data) => {
        console.table(data[0]);
      });
      return;
    }
    else if (menuResponse.menu === "View all roles") {
      // return table listing all roles
      viewRoles().then((data) => {
        console.table(data[0]);
      });
      return;
    }
    else if (menuResponse.menu === "View all employees") {
      // return table listing all employees
      viewEmployees().then((data) => {
        console.table(data[0]);
      });
      return;
    }
    else if (menuResponse.menu === "Add a department") {
      // prompt name of department
      return inquirer.prompt(
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?",
          validate: deptInput => {
            if (deptInput) {
              return true;
            }
            else {
              console.log("Please enter a department name!");
              return false;
            }
          }
        }
        // add a department to database
      ).then(deptInput => {
          addDepartment(deptInput);
          })
        .then(data => {
          console.log(data);
          //console.log(`Added ${data.name} to the database`);
        });
    }
    else if (menuResponse.menu === "Add a role") {
      // prompt role name, role salary, and department of role
      // post request to add role to database
      console.log("Add role");
      mainMenu();
      return;
    }
    else if (menuResponse.menu === "Add an employee") {
      // prompt employee's fist and last names, role, and manager
      // post request to add role to database
      console.log("Add employee");
      mainMenu();
      return;
    }
    else if (menuResponse.menu === "Update an employee role") {
      // prompt to select employee and select new role
      // put request to update employee in database
      console.log("Update employee");
      mainMenu();
      return;
    }
    else if (menuResponse.menu === "Quit") {
      // exit out of prompts
      console.log("quit");
      return;
    }
  })
}

mainMenu();