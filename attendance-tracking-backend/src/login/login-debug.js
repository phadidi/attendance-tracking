const lambdaLocal = require('lambda-local');
const handler = require('./login.js');
const testEvent = {
  //TODO: pass this in as stringify?
  body: '{\r\n    "userName": "jsmith",\r\n    "password": "jsmith2021"\r\n}',

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
