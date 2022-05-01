const db = require("./db/connection");
const {viewAllDepartments, addDepartment, viewRoles, viewEmployees, addRole} = require("./db/index.js");
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
          name: "dept",
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
      ).then(ansObj => {
          addDepartment(ansObj.dept);
          console.log(`Added ${ansObj.dept} to the database`);
          return;
        });
    }
    else if (menuResponse.menu === "Add a role") {
      // prompt role name, role salary, and department of role
      let deptArr = [];
      let deptObj = {};
      viewAllDepartments().then((data) => {
        deptObj = data[0];
        for (let i = 0; i < data[0].length; i++) {
          deptArr.push(data[0][i].name);
        }
      });
      return inquirer.prompt([
        {
          type: "input",
          name: "role",
          message: "What is the name of the role?",
          validate: roleInput => {
            if (roleInput) {
              return true;
            }
            else {
              console.log("Please enter a role name!");
              return false;
            }
          }
        },
        {
          type: "number",
          name: "salary",
          message: "What is the salary of the role?",
          validate: salaryInput => {
            if (salaryInput) {
              return true;
            }
            else {
              console.log("Please enter a salary!");
              return false;
            }
          }
        },
        {
          type: "list",
          name: "dept",
          message: "Which department does the role belong to?",
          choices: deptArr
        }
      ])
      // post request to add role to database
      .then(ansObj => {
        let index = deptArr.findIndex(deptName => deptName === ansObj.dept);
        let deptId = deptObj[index].id;
        ansObj.dept_id = deptId;
        delete ansObj.dept;
        let roleArr = [ansObj.role, ansObj.salary, ansObj.dept_id];
        addRole(roleArr);
        console.log(`Added ${ansObj.role} to the database`);
        return;
      })
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