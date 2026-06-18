export const TOPICS = [
  {
    id: 1,
    title: 'Schema & Data',
    exercises: [
      {
        id: 1,
        topicExerciseNum: 1,
        title: 'Create a table',
        description: 'Create a table called **students** with columns: `id` (INTEGER), `name` (TEXT), `age` (INTEGER).',
        seedSql: '',
        concept: 'The <strong>CREATE TABLE</strong> statement creates a new table in the database.<br><br><strong>Syntax:</strong><br><code>CREATE TABLE table_name (<br>&nbsp;&nbsp;column1 TYPE,<br>&nbsp;&nbsp;column2 TYPE,<br>&nbsp;&nbsp;...<br>);</code><br><br>Each column has a name and a data type. Common SQLite types: <code>INTEGER</code> (whole numbers), <code>TEXT</code> (strings), <code>REAL</code> (decimals), and <code>BLOB</code> (raw bytes).',
        hints: [
          'What SQL keyword do you use to create a new database table?',
          'After the table name, what appears inside parentheses — a list of what, separated by how?',
          'Each column needs a name and a type. For storing a student\'s ID, name, and age, what three types would you pick?',
        ],
        answer: "CREATE TABLE students (id INTEGER, name TEXT, age INTEGER);",
      },

      {
        id: 2,
        topicExerciseNum: 2,
        title: 'Insert data',
        description: 'Insert 5 students into the **students** table. Give them names and ages of your choice.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);",
        concept: 'The <strong>INSERT</strong> statement adds rows of data to a table.<br><br><strong>Syntax:</strong><br><code>INSERT INTO table_name VALUES (value1, value2, ...);</code><br><br>Values must match the column order from <code>CREATE TABLE</code>. Text values go in single quotes (<code>\'Alice\'</code>).<br><br>Insert multiple rows at once:<br><code>INSERT INTO table_name VALUES<br>&nbsp;&nbsp;(1, \'Alice\', 22),<br>&nbsp;&nbsp;(2, \'Bob\', 19);</code>',
        hints: [
          'Which SQL keyword adds new rows to a table?',
          'After INSERT INTO table_name, what keyword introduces the actual data values?',
          'Text values need quotes around them. Your table has columns (id, name, age) — what goes in each position?',
        ],
        answer: "INSERT INTO students VALUES\n  (1, 'Alice', 22),\n  (2, 'Bob', 19),\n  (3, 'Charlie', 25),\n  (4, 'Diana', 18),\n  (5, 'Eve', 30);",
      },

      {
        id: 15,
        topicExerciseNum: 3,
        title: 'UPDATE and DELETE',
        description: 'Write an **UPDATE** query to modify existing data (e.g., increase one student\'s age) and a **DELETE** query to remove a row (e.g., delete a course). Ensure referential integrity is considered.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30);\nCREATE TABLE IF NOT EXISTS courses (id INTEGER, student_id INTEGER, title TEXT);\nDELETE FROM courses;\nINSERT INTO courses VALUES (1, 1, 'Math'), (2, 1, 'Physics'), (3, 2, 'Chemistry'), (4, 3, 'Math');",
        concept: '<strong>UPDATE</strong> modifies existing rows: <code>UPDATE table SET col = value WHERE condition;</code><br><br><strong>DELETE</strong> removes rows: <code>DELETE FROM table WHERE condition;</code><br><br><strong>Always include a WHERE clause!</strong> Without it, UPDATE changes all rows and DELETE empties the table.',
        hints: [
          'What statement changes existing data — and what keyword sets the new value?',
          'What statement removes rows — and what keyword specifies a condition to identify them?',
          'What happens if you run UPDATE students SET age = 30 without a WHERE clause?',
        ],
        answer: "-- Update: increase age of student 1\nUPDATE students SET age = 23 WHERE id = 1;\n\n-- Delete: remove a course (no FK constraint, so it works directly)\nDELETE FROM courses WHERE id = 4;\n\n-- Verify changes\nSELECT * FROM students WHERE id = 1;\nSELECT * FROM courses;",
      },
    ],
  },

  {
    id: 2,
    title: 'Basic Queries',
    exercises: [
      {
        id: 3,
        topicExerciseNum: 1,
        title: 'Basic SELECT',
        description: 'Write a query to find all students older than 20.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30);",
        concept: 'The <strong>SELECT</strong> statement retrieves data from a table. <code>WHERE</code> filters rows based on a condition.<br><br><strong>Basic syntax:</strong><br><code>SELECT column1, column2 FROM table WHERE condition;</code><br><br>Use <code>*</code> for all columns. Comparison operators: <code>=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>&lt;&gt;</code> (not equal).',
        hints: [
          'What keyword selects data from a table? What keyword filters which rows appear?',
          'What symbol means "all columns"? What comparison operator means "greater than"?',
          'You want all students older than 20. That\'s SELECT * FROM students WHERE age ? 20 — what goes between age and 20?',
        ],
        answer: "SELECT * FROM students WHERE age > 20;",
        expectedResults: { columns: ['id', 'name', 'age'], values: [[1, 'Alice', 22], [3, 'Charlie', 25], [5, 'Eve', 30]] },
      },

      {
        id: 4,
        topicExerciseNum: 2,
        title: 'WHERE + ORDER BY',
        description: 'Find students whose name starts with **A** or **C**, ordered by age descending.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30), (6, 'Adam', 20);",
        concept: '<strong>ORDER BY</strong> sorts results — <code>ORDER BY col ASC</code> (ascending, default) or <code>DESC</code> (descending).<br><br><strong>LIKE</strong> matches text patterns:<br><code>LIKE \'A%\'</code> starts with "A"<br><code>LIKE \'%son\'</code> ends with "son"<br><code>LIKE \'%at%\'</code> contains "at"<br><br><strong>OR</strong> / <strong>AND</strong> combine conditions in WHERE.',
        hints: [
          'How do you sort results in SQL? What keyword puts them in descending order?',
          'What operator matches text patterns — and what wildcard means "any characters"?',
          'You need names starting with A OR C, sorted oldest first. That means WHERE name LIKE \'A%\' OR ..., then ORDER BY age what?',
        ],
        answer: "SELECT * FROM students\nWHERE name LIKE 'A%' OR name LIKE 'C%'\nORDER BY age DESC;",
        expectedResults: { columns: ['id', 'name', 'age'], values: [[3, 'Charlie', 25], [1, 'Alice', 22], [6, 'Adam', 20]] },
      },

      {
        id: 8,
        topicExerciseNum: 3,
        title: 'Ranges, AND/OR, NULL',
        description: 'Write queries that demonstrate:\n- `BETWEEN` to filter a range\n- `AND` / `OR` combined conditions\n- `IS NULL` to check for null values\n\nUse the **students** and **orders** tables.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30);\nCREATE TABLE IF NOT EXISTS orders (id INTEGER, student_id INTEGER, amount REAL, order_date TEXT);\nDELETE FROM orders;\nINSERT INTO orders VALUES (1, 1, 50.0, '2024-03-15'), (2, 2, 30.0, '2024-04-10'), (3, 3, 100.0, '2024-05-01'), (4, 1, 25.0, '2025-01-20'), (5, NULL, 15.0, '2025-02-01');",
        concept: '<strong>BETWEEN</strong> filters a range (inclusive): <code>WHERE age BETWEEN 20 AND 25</code>.<br><br><strong>AND</strong> / <strong>OR</strong> combine multiple conditions. Use parentheses to group: <code>WHERE (cond1 OR cond2) AND cond3</code>.<br><br><strong>IS NULL</strong> checks for missing values. Use <code>IS NULL</code>, not <code>= NULL</code> — NULL comparisons always fail.',
        hints: [
          'What keyword filters values within a range (inclusive)?',
          'How do you combine two conditions — what\'s the difference between AND and OR?',
          'How do you check whether a column has no value — and why is = NULL wrong?',
        ],
        answer: "-- BETWEEN: students aged 20-25\nSELECT * FROM students WHERE age BETWEEN 20 AND 25;\n\n-- AND / OR: students aged 20-25 OR named Alice\nSELECT * FROM students\nWHERE (age BETWEEN 20 AND 25) OR name = 'Alice';\n\n-- IS NULL: orders with no student (insert a null student_id first)\nINSERT INTO orders VALUES (5, NULL, 15.0, '2025-02-01');\nSELECT * FROM orders WHERE student_id IS NULL;",
      },

      {
        id: 13,
        topicExerciseNum: 4,
        title: 'LIMIT and top values',
        description: 'Write queries using **ORDER BY** combined with **LIMIT** to find top values: the 3 oldest students, the 5 most recent orders, and implement pagination using `LIMIT x OFFSET y`.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30), (6, 'Frank', 27);\nCREATE TABLE IF NOT EXISTS orders (id INTEGER, student_id INTEGER, amount REAL, order_date TEXT);\nDELETE FROM orders;\nINSERT INTO orders VALUES (1, 1, 50.0, '2024-03-15'), (2, 2, 30.0, '2024-04-10'), (3, 3, 100.0, '2024-05-01'), (4, 1, 25.0, '2025-01-20'), (5, 4, 40.0, '2025-02-10');",
        concept: '<strong>LIMIT</strong> restricts how many rows are returned: <code>LIMIT 3</code> → first 3 rows.<br><br><strong>OFFSET</strong> skips rows before the result: <code>LIMIT 2 OFFSET 2</code> → skips 2, returns next 2.<br><br>Always use <code>ORDER BY</code> with <code>LIMIT</code> for predictable results. This is how pagination works in SQL.',
        hints: [
          'What keyword at the end of a query limits how many rows are returned?',
          'What clause must come before LIMIT to ensure you get the right rows (e.g., oldest first)?',
          'To get rows 3 and 4, you\'d write LIMIT 2 — but what keyword skips the first 2 rows?',
        ],
        answer: "-- Top 3 oldest students\nSELECT * FROM students ORDER BY age DESC LIMIT 3;\n\n-- Most recent 5 orders\nSELECT * FROM orders ORDER BY order_date DESC LIMIT 5;\n\n-- Pagination: second page (rows 3-4)\nSELECT * FROM students ORDER BY age DESC LIMIT 2 OFFSET 2;",
      },
    ],
  },

  {
    id: 3,
    title: 'Aggregation',
    exercises: [
      {
        id: 6,
        topicExerciseNum: 1,
        title: 'GROUP BY and aggregation',
        description: 'Count how many students are in each age group. Use GROUP BY.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 22), (4, 'Diana', 19), (5, 'Eve', 30);",
        concept: '<strong>GROUP BY</strong> groups rows with the same values, typically used with aggregate functions.<br><br><strong>Common aggregates:</strong><br><code>COUNT(*)</code> — rows per group<br><code>SUM(col)</code> — total<br><code>AVG(col)</code> — average<br><br><strong>Syntax:</strong><br><code>SELECT column, COUNT(*) FROM table GROUP BY column;</code>',
        hints: [
          'What keyword groups rows that share a common value in a column?',
          'What function counts how many rows are in each group?',
          'You want to count students per age — SELECT age, COUNT(*) FROM students GROUP BY what?',
        ],
        answer: "SELECT age, COUNT(*) AS count\nFROM students\nGROUP BY age\nORDER BY age;",
        expectedResults: { columns: ['age', 'count'], values: [[19, 2], [22, 2], [30, 1]] },
      },

      {
        id: 7,
        topicExerciseNum: 2,
        title: 'Calculated fields and dates',
        description: 'Create an **orders** table with columns: `id` (INTEGER), `student_id` (INTEGER), `amount` (REAL), `order_date` (TEXT). Insert some rows. Then write a query that computes a calculated field (e.g., `amount * 1.1 AS with_tax`) and extracts the year from `order_date` using `strftime`.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30);\nCREATE TABLE IF NOT EXISTS orders (id INTEGER, student_id INTEGER, amount REAL, order_date TEXT);\nDELETE FROM orders;\nINSERT INTO orders VALUES (1, 1, 50.0, '2024-03-15'), (2, 2, 30.0, '2024-04-10'), (3, 3, 100.0, '2024-05-01'), (4, 1, 25.0, '2025-01-20');",
        concept: 'Perform <strong>arithmetic</strong> directly in SELECT: <code>amount * 1.1 AS with_tax</code>. The <strong>AS</strong> keyword names the calculated column (alias).<br><br><strong>strftime</strong> extracts date parts as text:<br><code>strftime(\'%Y\', date)</code> → year<br><code>strftime(\'%m\', date)</code> → month<br><code>strftime(\'%d\', date)</code> → day<br><code>strftime(\'%Y-%m\', date)</code> → year-month',
        hints: [
          'How do you compute a new value inside SELECT — can you use arithmetic operators directly?',
          'What keyword gives a calculated column a readable name?',
          'What SQLite function extracts the year from a date string like \'2024-03-15\'?',
        ],
        answer: "-- Create the orders table\nCREATE TABLE orders (id INTEGER, student_id INTEGER, amount REAL, order_date TEXT);\n\n-- Insert sample data\nINSERT INTO orders VALUES\n  (1, 1, 50.0, '2024-03-15'),\n  (2, 2, 30.0, '2024-04-10'),\n  (3, 3, 100.0, '2024-05-01'),\n  (4, 1, 25.0, '2025-01-20');\n\n-- Query with calculated field and date function\nSELECT\n  o.id,\n  o.amount,\n  o.amount * 1.1 AS with_tax,\n  strftime('%Y', o.order_date) AS year\nFROM orders o;",
      },

      {
        id: 10,
        topicExerciseNum: 3,
        title: 'MAX, MIN, AVG, SUM',
        description: 'Write aggregation queries using `MAX()`, `MIN()`, `AVG()`, and `SUM()` on the **students** and **orders** tables.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30);\nCREATE TABLE IF NOT EXISTS orders (id INTEGER, student_id INTEGER, amount REAL, order_date TEXT);\nDELETE FROM orders;\nINSERT INTO orders VALUES (1, 1, 50.0, '2024-03-15'), (2, 2, 30.0, '2024-04-10'), (3, 3, 100.0, '2024-05-01'), (4, 1, 25.0, '2025-01-20');",
        concept: '<strong>Aggregate functions</strong> compute a single value from a set of rows:<br><br><code>MAX(col)</code> — highest value<br><code>MIN(col)</code> — lowest value<br><code>AVG(col)</code> — average (mean)<br><code>SUM(col)</code> — total<br><code>COUNT(col)</code> — number of non-null values<br><br>Use with <code>GROUP BY</code> to get per-group aggregates.',
        hints: [
          'Which functions find the highest, lowest, and average value of a column?',
          'What function adds up all values in a numeric column?',
          'To get aggregates per student, what keyword groups orders by student_id before applying SUM and AVG?',
        ],
        answer: "-- Max / min / avg age of students\nSELECT\n  MAX(age) AS oldest,\n  MIN(age) AS youngest,\n  AVG(age) AS avg_age\nFROM students;\n\n-- Sum of all order amounts\nSELECT SUM(amount) AS total_orders FROM orders;\n\n-- Aggregates per student\nSELECT\n  student_id,\n  COUNT(*) AS orders,\n  SUM(amount) AS total,\n  AVG(amount) AS avg_amount\nFROM orders\nGROUP BY student_id;",
        expectedResults: { columns: ['oldest', 'youngest', 'avg_age'], values: [[30, 18, 22.8]] },
      },

      {
        id: 11,
        topicExerciseNum: 4,
        title: 'GROUP BY with HAVING',
        description: 'Write a query that groups **orders** by `student_id` and filters groups using **HAVING** to show only students with more than 1 order.',
        seedSql: "CREATE TABLE IF NOT EXISTS orders (id INTEGER, student_id INTEGER, amount REAL, order_date TEXT);\nDELETE FROM orders;\nINSERT INTO orders VALUES (1, 1, 50.0, '2024-03-15'), (2, 1, 30.0, '2024-04-10'), (3, 2, 100.0, '2024-05-01'), (4, 3, 25.0, '2025-01-20');",
        concept: '<strong>HAVING</strong> filters groups after <code>GROUP BY</code>, just like <code>WHERE</code> filters rows before grouping.<br><br>Use <code>WHERE</code> for individual rows, <code>HAVING</code> for groups:<br><code>GROUP BY col HAVING COUNT(*) &gt; 1</code><br><br>You can use aggregate functions in HAVING but not in WHERE.',
        hints: [
          'If WHERE filters rows before grouping, what keyword filters groups after GROUP BY?',
          'Can you use COUNT(*) inside a WHERE clause — or only inside HAVING?',
          'After GROUP BY student_id, what condition keeps only students with more than 1 order?',
        ],
        answer: "SELECT\n  student_id,\n  COUNT(*) AS order_count,\n  SUM(amount) AS total\nFROM orders\nGROUP BY student_id\nHAVING COUNT(*) > 1;",
        expectedResults: { columns: ['student_id', 'order_count', 'total'], values: [[1, 2, 80]] },
      },

      {
        id: 12,
        topicExerciseNum: 5,
        title: 'DISTINCT and unique counts',
        description: 'Write queries using **DISTINCT** to list unique values and **COUNT(DISTINCT ...)** to count unique values in the **courses** and **orders** tables.',
        seedSql: "CREATE TABLE IF NOT EXISTS courses (id INTEGER, student_id INTEGER, title TEXT);\nDELETE FROM courses;\nINSERT INTO courses VALUES (1, 1, 'Math'), (2, 1, 'Physics'), (3, 2, 'Chemistry'), (4, 3, 'Math');",
        concept: '<strong>DISTINCT</strong> removes duplicate values: <code>SELECT DISTINCT col FROM table;</code><br><br><strong>COUNT(DISTINCT col)</strong> counts how many unique values exist:<br><code>SELECT COUNT(DISTINCT title) FROM courses;</code><br><br>Useful for finding unique categories, customers, etc.',
        hints: [
          'What keyword goes right after SELECT to eliminate duplicate rows?',
          'How would you count how many distinct values a column contains?',
          'To find unique course titles, you write SELECT what before title FROM courses?',
        ],
        answer: "-- Unique course titles\nSELECT DISTINCT title FROM courses;\n\n-- Count distinct course titles\nSELECT COUNT(DISTINCT title) AS unique_courses FROM courses;\n\n-- Distinct student IDs that placed orders\nSELECT DISTINCT student_id FROM orders;",
        expectedResults: { columns: ['title'], values: [['Math'], ['Physics'], ['Chemistry']] },
      },
    ],
  },

  {
    id: 4,
    title: 'Joins & Subqueries',
    exercises: [
      {
        id: 5,
        topicExerciseNum: 1,
        title: 'JOIN two tables',
        description: 'Create a **courses** table with columns: `id` (INTEGER), `student_id` (INTEGER), `title` (TEXT). Insert some enrollment data. Then write a query that joins **students** with **courses** to show which student is enrolled in which course.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25);\nCREATE TABLE IF NOT EXISTS courses (id INTEGER, student_id INTEGER, title TEXT);\nDELETE FROM courses;\nINSERT INTO courses VALUES (1, 1, 'Math'), (2, 1, 'Physics'), (3, 2, 'Chemistry'), (4, 3, 'Math');",
        concept: '<strong>JOIN</strong> (INNER JOIN) combines rows from two tables based on a matching column.<br><br><strong>Syntax:</strong><br><code>SELECT a.col, b.col<br>FROM table_a a<br>JOIN table_b b ON a.id = b.fk;</code><br><br>The <code>ON</code> clause specifies how the tables relate. Table aliases (<code>a</code>, <code>b</code>) make queries shorter.',
        hints: [
          'What keyword joins two tables together in a SELECT query?',
          'The ON clause connects the tables — what common value links students and courses?',
          'Each course has a student_id. The student table has id. JOIN courses ON students.id = courses.?',
        ],
        answer: "-- First create the courses table\nCREATE TABLE courses (id INTEGER, student_id INTEGER, title TEXT);\n\n-- Insert enrollment data\nINSERT INTO courses VALUES\n  (1, 1, 'Math'),\n  (2, 1, 'Physics'),\n  (3, 2, 'Chemistry'),\n  (4, 3, 'Math');\n\n-- Join students with courses\nSELECT students.name, courses.title\nFROM students\nJOIN courses ON students.id = courses.student_id;",
      },

      {
        id: 9,
        topicExerciseNum: 2,
        title: 'Outer join and self-join',
        description: 'Write a **LEFT JOIN** query joining **students** with **orders** to show all students even those with no orders. Then create an **employees** table with a `manager_id` column referencing the same table and write a **self-join** to list each employee with their manager.',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30);\nCREATE TABLE IF NOT EXISTS orders (id INTEGER, student_id INTEGER, amount REAL, order_date TEXT);\nDELETE FROM orders;\nINSERT INTO orders VALUES (1, 1, 50.0, '2024-03-15'), (2, 2, 30.0, '2024-04-10'), (3, 3, 100.0, '2024-05-01'), (4, 1, 25.0, '2025-01-20');\nCREATE TABLE IF NOT EXISTS employees (id INTEGER, name TEXT, manager_id INTEGER);\nDELETE FROM employees;\nINSERT INTO employees VALUES (1, 'Alice', NULL), (2, 'Bob', 1), (3, 'Charlie', 1), (4, 'Diana', 2);",
        concept: '<strong>LEFT JOIN</strong> keeps all rows from the left table even without a match in the right table (unmatched columns show NULL).<br><br><strong>Self-join:</strong> join a table to itself using different aliases:<br><code>SELECT e.name, m.name AS manager<br>FROM employees e<br>LEFT JOIN employees m ON e.manager_id = m.id;</code><br><br>Useful for hierarchical data (org charts, categories).',
        hints: [
          'What kind of JOIN shows all rows from one table even if there\'s no match in the other?',
          'When joining a table to itself, what must you use to distinguish the two copies?',
          'A LEFT JOIN keeps all students. Unmatched orders columns show what value?',
        ],
        answer: "-- LEFT JOIN: all students with their orders\nSELECT students.name, orders.amount, orders.order_date\nFROM students\nLEFT JOIN orders ON students.id = orders.student_id;\n\n-- Self-join: create and query employees\nCREATE TABLE employees (id INTEGER, name TEXT, manager_id INTEGER);\nINSERT INTO employees VALUES\n  (1, 'Alice', NULL),\n  (2, 'Bob', 1),\n  (3, 'Charlie', 1),\n  (4, 'Diana', 2);\n\nSELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;",
      },

      {
        id: 14,
        topicExerciseNum: 3,
        title: 'Subqueries with IN, ANY, ALL',
        description: 'Write subqueries using **IN** (find students enrolled in specific courses), **ANY** (students older than any 25-year-old), and **ALL** (students older than all 25-year-olds).',
        seedSql: "CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT, age INTEGER);\nDELETE FROM students;\nINSERT INTO students VALUES (1, 'Alice', 22), (2, 'Bob', 19), (3, 'Charlie', 25), (4, 'Diana', 18), (5, 'Eve', 30);\nCREATE TABLE IF NOT EXISTS courses (id INTEGER, student_id INTEGER, title TEXT);\nDELETE FROM courses;\nINSERT INTO courses VALUES (1, 1, 'Math'), (2, 1, 'Physics'), (3, 2, 'Chemistry'), (4, 3, 'Math');",
        concept: 'A <strong>subquery</strong> is a query nested inside another, always in parentheses.<br><br><strong>IN (SELECT ...)</strong> — matches if value is in the subquery results.<br><code>WHERE id IN (SELECT student_id FROM courses WHERE ...)</code><br><br><strong>ANY</strong> — true if comparison holds for at least one subquery row.<br><strong>ALL</strong> — true if comparison holds for every subquery row.',
        hints: [
          'What do you put a query inside to use it as a subquery — and where does it go?',
          'What operator checks if a value matches ANY result from a subquery?',
          'To find students in Math courses: WHERE id IN (SELECT student_id FROM courses WHERE title = ?)',
        ],
        answer: "-- IN: students in Math or Physics courses\nSELECT * FROM students\nWHERE id IN (\n  SELECT student_id FROM courses\n  WHERE title IN ('Math', 'Physics')\n);\n\n-- ANY: students older than any 25-year-old (equivalent to age > 25 since only one value)\nSELECT * FROM students\nWHERE age > ANY (SELECT age FROM students WHERE age = 25);\n\n-- ALL: students older than all 25-year-olds\nSELECT * FROM students\nWHERE age > ALL (SELECT age FROM students WHERE age = 25);",
      },
    ],
  },
]

export const EXERCISES = TOPICS.flatMap(t => t.exercises)



export function checkCompletion(exercise, code, error, tables) {
  if (error) return false
  if (!exercise) return false
  const upper = code.trim().toUpperCase()
  switch (exercise.id) {
    case 1:
      if (!/\bCREATE\s+TABLE\b/i.test(upper)) return false
      return Array.isArray(tables) && tables.length > 0
    case 2:
      return /\bINSERT\s+INTO\b/i.test(upper)
    case 3:
      return /\bSELECT\b/i.test(upper) && !/\bCREATE\s+TABLE\b|\bINSERT\s+INTO\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bALTER\b/i.test(upper)
    case 4:
      return /\bWHERE\b/i.test(upper) && /\bORDER\s+BY\b/i.test(upper)
    case 5:
      return /\bJOIN\b/i.test(upper)
    case 6:
      return /\bGROUP\s+BY\b/i.test(upper)
    case 7:
      return /\bstrftime\b/i.test(upper) || /\bDATE\b/i.test(upper)
    case 8:
      return /\bBETWEEN\b/i.test(upper) || /\bIS\s+NULL\b/i.test(upper)
    case 9:
      return /\bLEFT\s+JOIN\b/i.test(upper) || /\bRIGHT\s+JOIN\b/i.test(upper)
    case 10:
      return /\b(MAX|MIN|AVG|SUM)\s*\(/i.test(upper)
    case 11:
      return /\bHAVING\b/i.test(upper)
    case 12:
      return /\bDISTINCT\b/i.test(upper)
    case 13:
      return /\bLIMIT\b/i.test(upper)
    case 14:
      return /\bIN\s*\(\s*SELECT\b/i.test(upper) || /\bANY\b/i.test(upper) || /\bALL\b/i.test(upper)
    case 15:
      return /\bUPDATE\b/i.test(upper) || /\bDELETE\b/i.test(upper)
    default:
      return false
  }
}