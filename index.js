const express = require("express");
const db = require("./db/connection");
const routes = require("./db/index");
const inquirer = require("inquirer");
const table = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", routes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

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
      // fetch/get request to return table listing all departments
      mainMenu();
      return;
    }
    else if (menuResponse.menu === "View all roles") {
      // fetch/get request to return table listing all roles
      console.log("View roles");
      mainMenu();
      return;
    }
    else if (menuResponse.menu === "View all employees") {
      // fetch/get request to return table listing all employees
      console.log("View employees");
      mainMenu();
      return;
    }
    else if (menuResponse.menu === "Add a department") {
      // prompt name of department
      // post request to add a department to database
      console.log("Add dept");
      mainMenu();
      return;
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

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});