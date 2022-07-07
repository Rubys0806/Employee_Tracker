const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({ 
    host: "localhost",
    port: "3306",
    user: "root",
    password: "secret",
    database: "employee_tracker_DB"
})


connection.connect(function (err) {
  if (err) 
  {throw err;}
  begin();
});

function begin(){
  inquirer
  .prompt([
  {
    type: 'list',
    name:'choices',
    message: 'What would you like to do?',
    choices: [
    'View all departments',
    'view all roles', 
    'view all employees', 
    'add a department', 
    'add a role', 
    'add an employee', 
    'update an employee role',
    'EXIT'
    ]
      
  }
  ])
  .then((res)=>{
    switch(res.choices){
      case 'View all departments':
        viewallDepartments();
        break;
      case 'View all roles':
        viewallRoles();
        break;
      case 'View all Employees':
        viewallEmployees();
        break;
      case 'Add a department':
        addaDepartment();
        break;
      case 'Add a role':
        addaRole();
        break;
      case 'Add an employee':
        addanEmployee();
        break;
      case 'Update an employee role':
        updateanemployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
      }
      
    }).catch((err)=>{
  if(err)throw err;
  });
}

function viewallDepartments() {
  let query =
  `SELECT 
      department.id, 
      department.name, 
  FROM employee
  LEFT JOIN role 
      ON employee.role_id = role.id
  LEFT JOIN department
      ON department.id = role.department_id
  GROUP BY department.id, department.name`;
  
  connection.query(query, (err, res)=>{
    if (err) throw err;
    console.table(res);
    begin();
  });
}


function viewallRoles(){
  let query = 
   `SELECT 
    role.title, 
    department.name, 
    role.salary, 
    FROM employee
    LEFT JOIN role 
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id
    GROUP BY role.id, role.name`; 

    connection.query(query, (err, res)=>{
      if (err) throw err;
      console.table(res);
      begin();
    });

}


function viewallEmployees(){
    let query = 
    `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department, 
        role.salary, 
    FROM employee
    LEFT JOIN role
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id`
  
    connection.query(query, (err, res)=>{
      if (err) throw err;
      console.table(res);
      firstPrompt();
    });
}

function addaDepartment(){
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Department Name: "
      }
    ]).then((res)=>{
    let query = `INSERT INTO department SET ?`;
    connection.query(query, {name: res.name},(err, res)=>{
      if(err) throw err;
      firstPrompt();
    });
  });
}

function addaRole(){
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Role Name: "
      }
    ]).then((res)=>{
    let query = `INSERT INTO role SET ?`;
    connection.query(query, {name: res.name},(err, res)=>{
      if(err) throw err;
      firstPrompt();
    });
  });
}

function addanEmployee(){
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_name",
        message: "Employee Name: "
      }
    ]).then((res)=>{
    let query = `INSERT INTO employee SET ?`;
    connection.query(query, {name: res.name},(err, res)=>{
      if(err) throw err;
      firstPrompt();
    });
  });
}

function updateanemployeeRole(employee){
  let query = 
  `SELECT 
    role.id, 
    role.title, 
    role.salary 
  FROM role`

  connection.query(query,(err, res)=>{
    if(err)throw err;
    let whichRole = res.map(({ id, title, salary }) => ({
      value: id, 
      title: `${title}`, 
      salary: `${salary}`      
    }));
    console.table(res);
    which(employee, whichRoles);
  });
}
  
function which(employee, whichRole) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee_name",
        message: `What's the name of the employee that needs their role updated? `,
        choices: employee
      },
      {
        type: "list",
        name: "role",
        message: "Select New Role: ",
        choices: whichRole
      },

    ]).then((res)=>{
      let query = `UPDATE employee SET role_id = ? WHERE id = ?`
      connections.query(query,[ res.role, res.employee],(err, res)=>{
          if(err)throw err;
          firstPrompt();
        });
    });
}

