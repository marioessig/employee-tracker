// consolidate SQL queries in one file
const employees = `
SELECT 
employee.id, 
employee.first_name AS 'First Name', 
employee.last_name AS 'Last Name', 
role.title AS 'Job Title', 
department.department_name AS 'Department', 
role.salary AS 'Salary', 
CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
FROM employee
LEFT JOIN employee manager on manager.id = employee.manager_id
INNER JOIN role ON (role.id = employee.role_id)
INNER JOIN department ON (department.id = role.department_id);
`
const departments = `
SELECT
department.id, 
department_name AS 'Departments'
FROM department;
`

const roles = `
SELECT
role.title AS 'Tile' ,
role.salary AS 'Salary',
department.department_name AS 'Department'
FROM role ,department
WHERE role.department_id = department.id;
`

const insertDepartment = `
INSERT INTO department (department_name)
VALUES (?)
`

const insertRole = `
INSERT INTO role SET ?
`

const insertEmployee = `
INSERT INTO employee SET ?
`

const updateEmployee = `
UPDATE employee
SET role_id = ?
WHERE id = ?;
`

module.exports = {
    employees,
    departments,
    roles,
    insertDepartment,
    insertRole,
    insertEmployee,
    updateEmployee
}