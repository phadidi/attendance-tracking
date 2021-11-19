const AWS = require('aws-sdk');
const utils = require('../common/utils');
const config = require('../common/config');
const mysql = require('serverless-mysql')({ config });

const addStudentAttendance = async (event) => {
  try {
    console.log('event:', event);
    const { studentId, classId, sectionId, hasAttendedToday } = JSON.parse(
      event.body
    );
    if (studentId && classId && sectionId && hasAttendedToday) {
      const today = new Date().toISOString().slice(0, 10);
      sql = `INSERT INTO attendance (studentId, classId, sectionId, dateOfAttendance) VALUES (?, ?, ?, ?);`;
      let newAttendance = await mysql.query(sql, [
        studentId,
        classId,
        sectionId,
        today
      ]);
      await mysql.end();
      return utils.createResponse(
        200,
        `Attendance of ${classId}, ${sectionId} by ${studentId} reported on ${today}`
      );
    } else {
      await mysql.end();
      return utils.createResponse(400, 'Invalid information provided');
    }
  } catch (err) {
    return utils.createResponse(err.status, err);
  }
};

module.exports = { handler: addStudentAttendance };
