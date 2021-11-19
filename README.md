# Attendance Tracking Application
There are 3 components in this application:
	1. MySQL database using AWS RDS MySQL
	2. Backend using AWS Lambda in Node.js
	3. Frontend using React.js
## MySQL Database Setup
		1. Create a database called AttendanceTracking
		2. Create a table called "users" with 6 fields:
			```CREATE TABLE users (
				userId INT PRIMARY KEY,
				firstName VARCHAR(50),
				lastName VARCHAR(50),
				userName VARCHAR(30) NOT NULL,
				pwd VARCHAR(30) NOT NULL,
				userRole ENUM('student', 'teacher') NOT NULL
			);```
			3. Create "class" table: 
				```CREATE TABLE class (
					classId INT PRIMARY KEY,
					className VARCHAR(100) NOT NULL,
					maxAttendancePossible INT NOT NULL
				);```
			4. Create "section" table: combination of classId and sectionId
				```CREATE TABLE section (
					sectionId INT PRIMARY KEY,
					classId INT NOT NULL,
					sectionName VARCHAR(100) NOT NULL,
					CONSTRAINT pk_sectionID PRIMARY KEY (sectionId, classId)
				);```
			5. Create "enrollment" table: 
				```CREATE TABLE enrollment (
					studentId INT NOT NULL,
					teacherId INT NOT NULL,
					classId INT NOT NULL,
					sectionId INT NOT NULL,
					CONSTRAINT pk_enrollmentID PRIMARY KEY (classId, sectionId, studentId)
				);```
			6. Create "attendance" table:
				```CREATE TABLE attendance (
					studentId INT NOT NULL,
					classId INT NOT NULL,
					sectionId INT NOT NULL,
					dateOfAttendance DATE NOT NULL,
					CONSTRAINT pk_attendancetID PRIMARY KEY (studentId, classId, sectionId, dateOfAttendance)
				);```
				* _dateOfAttendance is in YYYY-MM-DD_
### Assumptions
* Sections are considered as different periods offered for the same class
* For attendance criteria:
	* Each class comes with the maximum number of attendance possible: Example CS100 will have total of 20 class meetings so maxAttendancePossible is 20
	* Attendance Percentage for a student is the percentage of the class-section that the student has attended so far.
		* Example: student has attended 3 meetings of CS100, so the attendance percentage of student is 15%
	* Attendance Percentage for class [(sum of the attendance of each students in this class)/(maxAttendancePossible \* number of enrolled students)] \* 100.
		* Example:  2 students are enrolled in CS100 one has attended 6 and the other has attended 8 events which gives ((6 +8)/(2\*20)) \* 100 = 35%
## Attendance Tracking Backend (Lambda Functions)
* Added the following headers to prevent CORS errors:
	```
	headers: {
		'Access-Control-Allow-Origin': '*', // Required for CORS support to work
		'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers
	}
	```
#### Login Lambda
An HTTP POST request takes in userName and password from body and returns:
	* userId
	* userRole
	* firstName
	* lastName
#### Fetch Student Lambda
	1. An HTTP GET request takes in userId as a parameter
	2. A query is run in the enrollment MySQL table where studentId equals the given userId
	3. The returned classIds are used to run MySQL queries on the class table to fetch their corresponding className and maxAttendancePossible values
	4. The returned sectionIds are used to run MySQL queries on the section table to fetch their corresponding sectionName values
	5. The returned userIds, classIds and sectionIds are used to run MySQL queries on the attendance table to get the count of attendance rows and check if any attendance rows have been marked for today
	6. The Lambda output is then returned as:
	```[
		{
			classId,
			sectionId,
			className,
			sectionName,
			attendancePercentage,
			hasAttendedToday
		},
		{….}
	]```
#### Add Student Attendance Lambda
	1. An HTTP POST request takes in the body:
	```{
			studentId: int
			classId: int
			sectionId: int
			hasAttendedToday: bool
		}```
	2. If hasAttendedToday is true, run a query that inserts an attendance table row with classId, sectionId, studentId, and dateOfAttendance (the current Date in YYYY-MM-DD)
		* Otherwise, the UI will prevent the insertion of this row into the attendance table
_Lambda functions to support the Teacher Portal were not implemented due to time constraints_
## Attendance Tracking Frontend (Reactjs Interface)
* ```npx create-react-app``` was used to create the project template
* Material UI/Table were used as controls
* ```react-router-dom``` was used to route from one page to another
#### App.js
	A Router was defined with a list of page paths that it routes to, where Login is set as the default
		```<Router>
			  <div>
				<h1 align="center">Attendance Tracking</h1>
				<div className="container">
				  <Route exact path='/' component={Login} />
				  <Route exact path='/student' component={StudentPortal} />
				  <Route exact path='/teacher' component={TeacherPortal} />
				</div>
			  </div>
		</Router>```
#### Login Page (login.js)
	1. A username and password are provided
	2. When the Login button is clicked, the Login Lambda function is called
	3. If the Login is successful, a userRole, firstName, lastName, and userId are returned
	4. Based on the returned values, history.push is called to redirect either to the Student or Teacher Portal
#### Student Portal (studentPortal.js)
	1. MaterialTable displays a list of class-sections, each with attendancePercentage values and a checkbox column to mark attendance for today
		* uses hasAttendedToday boolean to mark attendance
	2. Each row's hasAttendedToday value is editable if the attendance table does not already have dateOfAttendance value for the current date in a row with the corresponding classId, sectionId, and studentId
	3. useState and useEffect keep the state of parameters consistent with the MySQL db rows and update the Student Portal page when attendance changes are made
	4. A Logout button reroutes back to the Login Page using history.push
#### Teacher Portal (teacherPortal.js)
	_This page was not fully implemented due to time constraints_
	1. If this page was fully implemented, two Material Tables would have been displayed.
	2. The Material Table on top would list the class sections and overall attendance percentage
	3. If a row on the class sections Material Table is clicked on, another Material Table underneath becomes visible which has the list of students and their attendances for that class section
	4. Similar to Student Dashboard, a logout button was included to reroute to Login homepage using history.push      

