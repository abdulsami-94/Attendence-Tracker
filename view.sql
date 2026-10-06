-- Atten Tracker: view stored data
-- Run with:  psql -d <your_db_name> -f view_data.sql
-- Column names are guesses. Check yours with:  \d users   and   \d attendance

-- List tables
\dt

-- All users
SELECT * FROM users;

-- Students only (drop the WHERE if role is stored as a number)
SELECT id, name, email FROM users WHERE role = 'STUDENT';

-- All attendance records
SELECT * FROM attendance;

-- Attendance with student names
SELECT a.id AS attendance_id,
       u.id AS student_id,
       u.name,
       a.marked_at
FROM attendance a
JOIN users u ON a.student_id = u.id
ORDER BY a.id;

-- Export to CSV (run from psql, saves in the folder you launched psql from):
-- \copy (SELECT a.id, u.id, u.name, a.marked_at FROM attendance a JOIN users u ON a.student_id = u.id ORDER BY a.id) TO 'attendance.csv' CSV HEADER