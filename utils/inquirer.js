// set dependencies
const connection = require('./connection')
const inquirer = require('inquirer')
const consoleTable = require('console.table')
const { employees, departments, roles, insertDepartment, insertRole, insertEmployee } = require('./query')


//this function loads the 'home page'
const startPage = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'startChoice',
            message: 'What would you like to do?',
            choices: [
                'View all departments', 
                'View all employees', 
                'View all roles', 
                'Add employee', 
                'Add department', 
                'Add role', 
                "Update employee's manager", 
                'Update employee role', 
                'View employees by manager', 
                'View employees by department', 
                'Exit'
            ]

        }
    ])
        //after it asks you what you want to do it runs the appropriate function
        .then(({ startChoice }) => {
            switch (startChoice) {
                case 'View all departments':
                    getDeps();
                    break;
                case 'View all employees':
                    getEmployees();
                    break;
                case 'View all roles':
                    getRoles();
                    break;
                case 'Add department':
                    addDep();
                    break;
                case 'Add employee':
                    addEmployee()
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Update employee role':
                    updateEmployee()
                    break;
                case "Update employee's manager":
                    updateManager()
                    break;
                case "View employees by department":
                    viewByDepartment()
                    break;
                case 'View employees by manager':
                    viewByManager()
                    break;
                case 'Exit':
                    console.log('Program Exited.')
                    connection.end();
                    break;
            }
        })
}

// display table of departments
const getDeps = () => {
    connection.query(departments, function (err, res) {
        if (err) throw err;
        console.table(res);
        startPage();
    });
}

// load table of employees
const getEmployees = () => {
    connection.query(employees, function (err, res) {
        if (err) throw err;
        console.table(res);
        startPage();
    });
}

// display table of roles
const getRoles = () => {
    connection.query(roles, function (err, res) {
        if (err) throw err;
        console.table(res);
        startPage();
    });
}

// function to add new department
const addDep = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDep',
            message: 'Enter the name of the department you would like to add:',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a department.');
                    return false;
                }
            }

        }
    ])
        .then(({ newDep }) => {
            connection.query(insertDepartment, newDep, function (err, res) {
                if (err) throw err;
                console.table(res);
                startPage();
            })
        })

}

// function to add new role
function addRole() {
    inquirer.prompt([{
        name: 'title',
        type: 'input',
        message: 'Enter the role title: '
    },
    {
        name: 'salary',
        type: 'number',
        message: 'Enter the roles salary: ',
        ...validateNumbers()
    },
    {
        name: 'department',
        type: 'list',
        message: 'Select a department: ',
        choices: queryDepartments()
    }
    ])
        .then(response => {

            // get department ID
            connection.query('SELECT id FROM department WHERE department_name = ?', [response.department], (error, result) => {

                if (error) throw error;
                result.forEach(id => {
                    resId = id.id;
                })

                // add the role into the database
                connection.query(insertRole, {
                    title: response.title,
                    salary: response.salary,
                    department_id: resId
                }, (error) => {
                    if (error) throw error;
                })

                getRoles();
            })
        })
}

// update an employee
function updateEmployee() {
    inquirer.prompt([
        {
            name: 'captcha',
            type: 'input',
            message: "Type anything to confirm you are smarter than an AI."
        },
        {
            name: 'updateEmployee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: queryEmployees()
        },
        {
            type: 'list',
            name: 'updateRole',
            message: 'Which role would you like the employee to have?',
            choices: queryRoles()
        }

    ])
        .then(({ updateEmployee, updateRole }) => {
            connection.query('SELECT id FROM role WHERE title = ?', updateRole, (err, res) => {
                if (err) throw error;

                const roleId = res[0].id

                let employeeName = updateEmployee.split(' ')

                connection.query('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?', [roleId, employeeName[0], employeeName[1]], (error, result) => {
                    if (error) throw error;

                    getEmployees();
                })
            })
        })
}

// add new employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name: ",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a first name.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a last name.');
                    return false;
                }
            }
        },
        {
            name: 'role',
            type: 'list',
            message: 'Select a role:',
            choices: queryRoles()
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Select the manager:',
            choices: queryEmployees()
        }
    ])
        .then(({ firstName, lastName, role, manager }) => {

            //this is a chain of queries to get the correct data to add to the employee DB
            connection.query('SELECT id FROM role WHERE title = ?', role, (err, res) => {
                if (err) throw error;

                const roles_id = res[0].id

                let managerName = manager.split(' ')

                connection.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [managerName[0], managerName[1]], (err, res) => {
                    if (err) throw error;

                    const managers_id = res[0].id

                    connection.query(insertEmployee, {
                        first_name: firstName,
                        last_name: lastName,
                        role_id: roles_id,
                        manager_id: managers_id
                    }, (error) => {
                        if (error) throw error;
                    })
                    getEmployees();
                })
            })
        })
}

// update manager
function updateManager() {
    inquirer.prompt([
        {
            name: 'captcha',
            type: 'input',
            message: "Confirm you are smarter than an AI."
        },
        {
            name: 'updateEmployee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: queryEmployees()
        },
        {
            type: 'list',
            name: 'updateManager',
            message: "Who is the employee's manager?",
            choices: queryEmployees()
        }

    ])
        .then(({ updateEmployee, updateManager }) => {
            let manager = updateManager.split(' ')
            connection.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [manager[0], manager[1]], (err, res) => {
                if (err) throw error;

                const managerId = res[0].id

                let employeeName = updateEmployee.split(' ')

                connection.query('UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?', [managerId, employeeName[0], employeeName[1]], (error, result) => {
                    if (error) throw error;

                    getEmployees();
                })
            })
        })
}

// get table of employees by manager
const viewByManager = () => {
    inquirer.prompt([
        {
            name: 'captcha',
            type: 'input',
            message: "Confirm you aren't a robot - type anything"
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Which managers employees would you like to see?',
            choices: queryManagers()
        }
    ])
        .then(({ manager }) => {
            let viewEmpsOf = manager.split(' ')

            connection.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [viewEmpsOf[0], viewEmpsOf[1]], (err, res) => {
                if (err) throw error;

                let managerId = res[0].id

                connection.query("SELECT first_name AS 'First name', last_name AS 'Last name' FROM employee WHERE manager_id = ?", managerId, (err, res) => {
                    console.table(res)
                    startPage();
                })
            })
        })
}

const viewByDepartment = () => {
    inquirer.prompt([
        {
            name: 'captcha',
            type: 'input',
            message: "Confirm you aren't a robot - type anything"
        },
        {
            name: 'departments',
            type: 'list',
            message: 'Which department would you like to view?',
            choices: queryDepartments()
        }
    ])
        .then(({ departments }) => {
            connection.query('SELECT id FROM department WHERE department_name = ?', departments, (err, res) => {
                if (err) throw error;

                let depId = res[0].id

                connection.query('SELECT id FROM role WHERE department_id = ?', depId, (err, res) => {
                    if (err) throw error;

                    let dep1 = 0
                    let dep2 = 0

                    if (res.length > 1) {
                        dep1 = res[0].id
                        dep2 = res[1].id
                    } else {
                        dep1 = res[0].id
                    }

                    connection.query("SELECT first_name AS 'First name', last_name AS 'Last name' FROM employee WHERE role_id = ? OR role_id = ?", [dep1, dep2], (err, res) => {
                        if (err) throw error;

                        console.table(res)
                        startPage();
                    })
                })
            })
        })
}

function queryManagers() {
    let managers = []
    connection.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', (err, res) => {
        if (err) throw error;

        res.forEach(manager => {

            name = manager.first_name.concat(' ', manager.last_name)
            managers.push(name)
        })
    })
    return managers;
}


// get roles to present as choices 
function queryRoles() {
    let roles = [];
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw error;

        res.forEach(role => {
            roles.push(role.title);
        })
    })

    return roles;
}

// gets employees to present as choices
function queryEmployees() {
    let employeeArray = []
    let sql = 'SELECT first_name, last_name FROM employee'
    connection.promise().query(sql)

        .then(([data]) => {

            data.forEach(({ first_name, last_name }) => {
                name = first_name.concat(' ', last_name)
                employeeArray.push(name)
            })
        })


    return employeeArray;
}

// get departments to present as choices
function queryDepartments() {
    let departments = [];
    connection.query('SELECT department_name FROM department', (error, response) => {
        if (error) throw error;

        response.forEach(department => {
            departments.push(department.department_name);
        })
    })

    return departments
}

// data validation
const validateNumbers = moreValidationChecks => ({
    validate: input => {
        if (input === '') {
            return 'Please provide a valid number greater then 0'
        }
        return moreValidationChecks ? moreValidationChecks(input) : true
    },
    filter: input => {
        return Number.isNaN(input) || Number(input) <= 0 ? '' : Number(input)
    },
})

module.exports = { startPage }