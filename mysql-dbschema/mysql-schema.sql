CREATE DATABASE AttendanceTracking;

USE AttendanceTracking;

CREATE TABLE users (
	userId INT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    userName VARCHAR(30) NOT NULL,
    pwd VARCHAR(30) NOT NULL,
    userRole ENUM('student', 'teacher') NOT NULL
);

-- desc users;

INSERT INTO users (userId, firstName, lastName, userName, pwd, userRole) VALUES
(10, 'Jean', 'Smith', 'jsmith', 'jsmith2021', 'student'),
(11, 'Sam', 'Sellers', 'ssellers', 'ssellers2021', 'student'),
(20, 'Marge', 'Beecher', 'mbeecher', 'mbeecher2021', 'teacher'),
(21, 'Jody', 'Baker', 'jbaker', 'jbaker2021', 'teacher');

-- SELECT * FROM users;

CREATE TABLE class (
	classId INT PRIMARY KEY,
    className VARCHAR(100) NOT NULL,
    maxAttendancePossible INT NOT NULL
);

-- desc class;

INSERT INTO class (classId, className, maxAttendancePossible) VALUES
(30271, 'CS100', 20),
(30273, 'CS121', 30);

-- SELECT * FROM class;
-- sectionId combined with classId make up a unique row
CREATE TABLE section (
	sectionId INT NOT NULL,
    classId INT NOT NULL,
    sectionName VARCHAR(100) NOT NULL,
    CONSTRAINT pk_sectionID PRIMARY KEY (sectionId, classId)
);

-- desc section;

INSERT INTO section (sectionId, classId, sectionName) VALUES
(100, 30271, '100A'),
(101, 30271, '100B'),
(200, 30273, '121A'),
(201, 30273, '121B');

-- SELECT * FROM section;
-- A student cannot attend more than ONE class section
CREATE TABLE enrollment (
	studentId INT NOT NULL,
    teacherId INT NOT NULL,
    classId INT NOT NULL,
    sectionId INT NOT NULL,
    CONSTRAINT pk_enrollmentID PRIMARY KEY (classId, sectionId, studentId)
);

-- desc enrollment;

INSERT INTO enrollment (studentId, teacherId, classId, sectionId) VALUES
(10, 20, 30271, 100),
(10, 20, 30273, 200),
(11, 21, 30271, 101),
(11, 21, 30273, 201);

-- SELECT * FROM enrollment;

CREATE TABLE attendance (
	studentId INT NOT NULL,
    classId INT NOT NULL,
    sectionId INT NOT NULL,
    dateOfAttendance DATE NOT NULL,
    CONSTRAINT pk_attendancetID PRIMARY KEY (studentId, classId, sectionId, dateOfAttendance)
);

-- desc attendance;

INSERT INTO attendance (studentId, classId, sectionId, dateOfAttendance) VALUES
(10, 30271, 100, '2021-10-15'),
(10, 30271, 100, '2021-10-30'),
(10, 30271, 100, '2021-11-7'),
(10, 30273, 200, '2021-10-15'),
(11, 30273, 201, '2021-10-22'),
(11, 30273, 201, '2021-10-25'),
(11, 30271, 101, '2021-10-30');

-- SELECT * FROM attendance;

-- delete from attendance where dateOfAttendance like '2021-11-19';

-- select className, maxAttendancePossible from class where classId=30271;
-- select sectionName from section where sectionId=100;

-- select count(*) from attendance where studentId=10 and classId=30271;