INSERT INTO department (department_name)
VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Accountant', 70000, 2),
('Lawyer', 180000, 3),
('Lead Engineer', 150000, 1),
('Legal Team Lead', 200000, 3),
('Sales Lead', 50000, 4),
('Salesperson', 45000, 4),
('Software Engineer', 110000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Mario', 'Bros',             3, null),
('Luigi', 'Bros',             7, 1),
('Princess', 'Peach',         4, 1),
('Yoshisaur', 'Muchakoopas',  1, 1),
('Bowser', 'KingKoopa',       2, 3),
('Wario', 'Warui',            6, 5),
('Princess', 'Diasy',         5, 5);