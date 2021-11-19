const lambdaLocal = require('lambda-local');
const handler = require('./fetchStudent.js');
const testEvent = {
  queryStringParameters: {
    studentId: 10
  },
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
