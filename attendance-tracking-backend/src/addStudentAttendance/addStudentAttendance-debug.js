const lambdaLocal = require('lambda-local');
const handler = require('./addStudentAttendance.js');
const testEvent = {
  body:
    ' {\r\n' +
    '    "studentId": 11,\r\n' +
    '    "classId": 30273,\r\n' +
    '    "sectionId": 201,\r\n' +
    '    "hasAttendedToday": true\r\n' +
    '}',
  headers: {
    'Content-Type': 'application/json'
  }
};
lambdaLocal
  .execute({
    event: testEvent,
    lambdaFunc: handler,
    lambdaHandler: 'handler'
  })
  .then(function (done) {
    console.log(done);
  })
  .catch(function (err) {
    console.log(err);
  });
