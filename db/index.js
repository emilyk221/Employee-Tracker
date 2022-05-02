const db = require("./connection");

// Get all departments
const viewAllDepartments = () => {
  return db.promise().query(`SELECT * FROM department`);
}

// Add a department
const addDepartment = deptName => {
  db.query(`INSERT INTO department (name)
  VALUES (?)`, deptName);
}

// Get all roles
const viewRoles = () => {
  return db.promise().query(`SELECT role.id AS id, role.title AS title, department.name AS department, role.salary FROM role
  JOIN department ON role.department_id = department.id`);
}

// Add a role
const addRole = roleArr => {
  db.query(`INSERT INTO role (title, salary, department_id)
  VALUES (?,?,?)`, roleArr);
}

// Get all employees
const viewEmployees = () => {
  return db.promise().query(`SELECT employee.id AS id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, employee.manager_id as manager FROM employee
  JOIN role ON employee.role_id = role.id
  JOIN department ON role.department_id = department.id`);
}

// Get all managers
const viewManagers = () => {
  return db.promise().query(`SELECT * FROM employee WHERE (id IN (SELECT manager_id FROM employee))`);
}

// Add an employee
const addEmployee = empArr => {
  db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?,?)`, empArr);
}

// Update an employee's role
const updateEmployee = arr => {
  db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, arr);
}

module.exports = {viewAllDepartments, addDepartment, viewRoles, viewEmployees, addRole, addEmployee, viewManagers, updateEmployee};