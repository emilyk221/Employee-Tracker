const express = require("express");
const router = express.Router();
const db = require("./connection");

// Get all departments
router.get("/departments", (req, res) => {
  db.query(`SELECT * FROM department`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// Add a department
router.post("/department", ({ body }, res) => {
  const sql = `INSERT INTO department (name)
    VALUES (?)`;
  const params = [body.name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body
    });
  });
});

// Get all roles
router.get("/roles", (req, res) => {
  db.query(`SELECT role.title AS job_title, role.id AS role_id, department.name AS department_name, role.salary FROM role JOIN department ON role.department_id = department.id`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// Add a role
router.post("/role", ({ body }, res) => {
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
  const params = [body.title, body.salary, body.department_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body
    });
  });
});

// Get all employees
router.get("/employees", (req, res) => {
  db.query(`SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department_name, role.salary AS salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// Add an employee
router.post("/employee", ({ body }, res) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body
    });
  });
});

// Update an employee's role
router.put("/employee/:id", (req, res) => {
  const sql = `UPDATE employee SET role_id = ?
  WHERE id = ?`;
  const params = [req.body.role_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    else if (!result.affectedRows) {
      res.json({
        message: "Employee not found"
      });
    }
    else {
      res.json({
        message: "success",
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

module.exports = router;