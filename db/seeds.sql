-- prepopulate database

INSERT INTO department (name)
VALUES  ('Marketing'), 
        ('Accounting'), 
        ('Engineering'), 
        ('Human Resources'),
        ('Legal');


INSERT INTO role (title, salary, department_id) 
VALUES  ('Marketing Manager', 100000, 1),
        ('Marketing Analyst', 55000, 1),
        ('Accounting Manager', 120000, 2),
        ('Accountant', 70000, 2),
        ('Tech Lead', 150000, 3),
        ('Software Engineer', 80000, 3),
        ('HR Manager', 110000, 4),
        ('Recruiter', 50000, 4),
        ('Corporate Lawyer', 130000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Winston', 'Morris', 1, NULL),
        ('Amanda', 'Hernandez', 2, 1),
        ('Gemma', 'Huerta', 3, NULL),
        ('Darius', 'Reese', 4, 3),
        ('John', 'Smith', 5, NULL),
        ('Alexander', 'Byrd', 6, 5),
        ('Elliott', 'Clements', 7, NULL),
        ('Jane', 'Wick', 8, 7),
        ('David', 'Wayne', 9, NULL);
