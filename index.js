const {viewAllDepartments, addDepartment, viewRoles, viewEmployees, addRole, addEmployee, viewManagers, updateEmployee} = require("./db/index.js");
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
        mainMenu();
      });
      return;
    }
    else if (menuResponse.menu === "View all roles") {
      // return table listing all roles
      viewRoles().then((data) => {
        console.table(data[0]);
        mainMenu();
      });
      return;
    }
    else if (menuResponse.menu === "View all employees") {
      // return table listing all employees
      viewEmployees().then((data) => {
        console.table(data[0]);
        mainMenu();
      });
      return;
    }
    else if (menuResponse.menu === "Add a department") {
      // prompt name of department
      promptDept();
      return;
    }
    else if (menuResponse.menu === "Add a role") {
      // prompt name, salary and department of role
      promptRole();
      return;
    }
    else if (menuResponse.menu === "Add an employee") {
      // prompt first and last names, role, and manager
      promptEmployee();
      return;
    }
    else if (menuResponse.menu === "Update an employee role") {
      // prompt to select an employee and their new role
      promptUpdateEmp();
      return;
    }
    else if (menuResponse.menu === "Quit") {
      // exit out of prompts
      return;
    }
  })
}

const promptDept = () => {
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
      mainMenu();
      return;
    });
}

const promptRole = () => {
  // get department list and save as an array to use in prompt
  let deptArr = [];
  let depts = {};
  viewAllDepartments().then((data) => {
    depts = data[0];
    for (let i = 0; i < data[0].length; i++) {
      deptArr.push(data[0][i].name);
    }
  })
  // prompt role name, role salary, and department of role
  .then(() => {
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
  })
  // add role to database
  .then(ansObj => {
    let index = deptArr.findIndex(deptName => deptName === ansObj.dept);
    let deptId = depts[index].id;
    ansObj.dept_id = deptId;
    let roleArr = [ansObj.role, ansObj.salary, ansObj.dept_id];
    addRole(roleArr);
    console.log(`Added ${ansObj.role} to the database`);
    mainMenu();
    return;
  })
}

const promptEmployee = () => {
  // get role list and manager list and save as arrays to use in prompt
  let roleArr = [];
  let roles = {};
  let managerArr = ["None"];
  let managers = {};
  viewRoles().then((data) => {
    roles = data[0];
    for (let i = 0; i < data[0].length; i++) {
      roleArr.push(data[0][i].title);
    }
  });
  viewManagers().then((data) => {
    managers = data[0];
    for (let i = 0; i < data[0].length; i++) {
      managerArr.push(data[0][i].first_name + " " + data[0][i].last_name);
    }
  })
  // prompt employee's first and last names, role, and manager
  .then(() => {
    return inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          }
          else {
            console.log("Please enter the employee's first name!");
            return false;
          }
        }
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
        validate: nameInput => {
          if (nameInput) {
            return true;
          }
          else {
            console.log("Please enter the employee's last name!");
            return false;
          }
        }
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roleArr
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managerArr
      }
    ])
  })
  // add employee to database
  .then(ansObj => {
    let roleIndex = roleArr.findIndex(roleTitle => roleTitle === ansObj.role);
    let roleId = roles[roleIndex].id;
    ansObj.role_id = roleId;
    let managerIndex = managerArr.findIndex(name => name === ansObj.manager);
    let managerId;
    if (managerIndex === 0) {
      managerId = null;
    }
    else {
      managerId = managers[(managerIndex - 1)].id;
    }
    ansObj.manager_id = managerId;
    let empArr = [ansObj.first_name, ansObj.last_name, ansObj.role_id, ansObj.manager_id];
    addEmployee(empArr);
    console.log(`Added ${ansObj.first_name} ${ansObj.last_name} to the database`);
    mainMenu();
    return;
  })
}

const promptUpdateEmp = () => {
  // get role list and employee list and save as arrays to use in prompt
  let rolesArr = [];
  let roles = {};
  let employeeArr = [];
  let employees = {};
  viewRoles().then((data) => {
    roles = data[0];
    for (let i = 0; i < data[0].length; i++) {
      rolesArr.push(data[0][i].title);
    }
  });
  viewEmployees().then((data) => {
    employees = data[0];
    for (let i = 0; i < data[0].length; i++) {
      employeeArr.push(data[0][i].first_name + " " + data[0][i].last_name);
    }
  })
  // prompt to select employee and select new role
  .then(() => {
    return inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        choices: employeeArr
      },
      {
        type: "list",
        name: "role",
        message: "Which role do you want to assign to the selected employee?",
        choices: rolesArr
      }
    ])
  })
  // put request to update employee in database
  .then(ansObj => {
    let roleIndex = rolesArr.findIndex(roleTitle => roleTitle === ansObj.role);
    let roleId = roles[roleIndex].id;
    ansObj.role_id = roleId;
    let empIndex = employeeArr.findIndex(empName => empName === ansObj.employee);
    let empId = employees[empIndex].id;
    ansObj.employee_id = empId;
    let arr = [ansObj.role_id, ansObj.employee_id];
    updateEmployee(arr);
    mainMenu();
    return;
  });
}

mainMenu();