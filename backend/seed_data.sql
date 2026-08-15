-- ============================================================
-- SEED DATA — matched to actual schema (users / session / attendance_record)
-- Password for every seeded account: password123
-- Attendance is IMPLICIT: a row in attendance_record = present.
-- No row for a student on a session = absent. There is no status column.
-- ============================================================

BEGIN;

-- Clean slate for repeatable runs
DELETE FROM attendance_record
  WHERE student_id IN (SELECT id FROM users WHERE email LIKE '%@seed.test')
     OR session_id IN (SELECT id FROM session WHERE teacher_id IN (SELECT id FROM users WHERE email LIKE '%@seed.test'));
DELETE FROM session WHERE teacher_id IN (SELECT id FROM users WHERE email LIKE '%@seed.test');
DELETE FROM users WHERE email LIKE '%@seed.test';

-- ---------- Teachers ----------
INSERT INTO users (email, password, role, name) VALUES
('teacher1@seed.test', '$2b$10$rBkECawnpSpSineIoinJLumucyOuyqo4E1hoq1rHDP8HR9ypsrZni', 'TEACHER', 'Anita Rao'),
('teacher2@seed.test', '$2b$10$rBkECawnpSpSineIoinJLumucyOuyqo4E1hoq1rHDP8HR9ypsrZni', 'TEACHER', 'Rahul Deshmukh');

-- ---------- Students ----------
INSERT INTO users (email, password, role, name) VALUES
('student1@seed.test', '$2b$10$rBkECawnpSpSineIoinJLumucyOuyqo4E1hoq1rHDP8HR9ypsrZni', 'STUDENT', 'Priya Sharma'),
('student2@seed.test', '$2b$10$rBkECawnpSpSineIoinJLumucyOuyqo4E1hoq1rHDP8HR9ypsrZni', 'STUDENT', 'Arjun Mehta'),
('student3@seed.test', '$2b$10$rBkECawnpSpSineIoinJLumucyOuyqo4E1hoq1rHDP8HR9ypsrZni', 'STUDENT', 'Sneha Kulkarni'),
('student4@seed.test', '$2b$10$rBkECawnpSpSineIoinJLumucyOuyqo4E1hoq1rHDP8HR9ypsrZni', 'STUDENT', 'Vikram Singh'),
('student5@seed.test', '$2b$10$rBkECawnpSpSineIoinJLumucyOuyqo4E1hoq1rHDP8HR9ypsrZni', 'STUDENT', 'Fatima Sheikh');

-- ---------- Sessions (3 past, ended sessions across 2 teachers) ----------
INSERT INTO session (active, current_token, expiry_time, room_number, start_time, subject, teacher_id, latitude, longitude, radius_meters) VALUES
(false, 'SEED-TOK-001', NOW() - INTERVAL '4 days' + INTERVAL '1 hour', 'B204', NOW() - INTERVAL '4 days', 'Data Structures',
  (SELECT id FROM users WHERE email = 'teacher1@seed.test'), 18.5204, 73.8567, 50),
(false, 'SEED-TOK-002', NOW() - INTERVAL '2 days' + INTERVAL '1 hour', 'B204', NOW() - INTERVAL '2 days', 'Software Engineering',
  (SELECT id FROM users WHERE email = 'teacher1@seed.test'), 18.5204, 73.8567, 50),
(false, 'SEED-TOK-003', NOW() - INTERVAL '1 days' + INTERVAL '1 hour', 'A101', NOW() - INTERVAL '1 days', 'Computer Networks',
  (SELECT id FROM users WHERE email = 'teacher2@seed.test'), 18.5204, 73.8567, 50);

-- ---------- Attendance (deliberately uneven so % isn't 0 or 100) ----------

-- Session 1 (Data Structures): everyone present except student4
INSERT INTO attendance_record (device_id, latitude, longitude, timestamp, session_id, student_id)
SELECT 'SEED-DEVICE-' || u.email, 18.5204, 73.8567, s.start_time + INTERVAL '5 minutes', s.id, u.id
FROM session s, users u
WHERE s.subject = 'Data Structures'
  AND u.role = 'STUDENT' AND u.email LIKE '%@seed.test'
  AND u.email != 'student4@seed.test';

-- Session 2 (Software Engineering): student1, student2 absent
INSERT INTO attendance_record (device_id, latitude, longitude, timestamp, session_id, student_id)
SELECT 'SEED-DEVICE-' || u.email, 18.5204, 73.8567, s.start_time + INTERVAL '5 minutes', s.id, u.id
FROM session s, users u
WHERE s.subject = 'Software Engineering'
  AND u.role = 'STUDENT' AND u.email LIKE '%@seed.test'
  AND u.email NOT IN ('student1@seed.test', 'student2@seed.test');

-- Session 3 (Computer Networks): student3, student5 absent
INSERT INTO attendance_record (device_id, latitude, longitude, timestamp, session_id, student_id)
SELECT 'SEED-DEVICE-' || u.email, 18.5204, 73.8567, s.start_time + INTERVAL '5 minutes', s.id, u.id
FROM session s, users u
WHERE s.subject = 'Computer Networks'
  AND u.role = 'STUDENT' AND u.email LIKE '%@seed.test'
  AND u.email NOT IN ('student3@seed.test', 'student5@seed.test');

COMMIT;

-- ============================================================
-- Login with any @seed.test email + password: password123
-- ============================================================