const AWS = require('aws-sdk');
const utils = require('../common/utils');
const config = require('../common/config');
const mysql = require('serverless-mysql')({ config });

const login = async (event) => {
  try {
    const { userName, password } = JSON.parse(event.body);
    console.log(`userName: ${userName}, password: ${password}`);
    if (userName && password) {
      let sql = `select * from users where userName=? and pwd=?`;
      let results = await mysql.query(sql, [userName, password]);
      await mysql.end();
      if (results && results.length > 0 && results[0] !== undefined) {
        const res = [
          {
            userId: results[0].userId,
            userRole: results[0].userRole,
            firstName: results[0].firstName,
            lastName: results[0].lastName
          }
        ];
        return utils.createResponse(200, res);
      } else {
        return utils.createResponse(
          400,
          'No matching username and/or password record'
        );
      }
    } else {
      return utils.createResponse(401, 'Invalid username and/or password');
    }
  } catch (err) {
    return utils.createResponse(err.status, err);
  }
};

module.exports = { handler: login };
