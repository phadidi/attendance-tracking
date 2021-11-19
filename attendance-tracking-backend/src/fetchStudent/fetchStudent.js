const AWS = require('aws-sdk');
const utils = require('../common/utils');
const config = require('../common/config');
const mysql = require('serverless-mysql')({ config });

const fetchStudent = async (event) => {
  try {
    console.log('event:', event);
    const userId = event['queryStringParameters']['studentId'];
    if (userId) {
      console.log('userId:', userId);
      let sql = `select * from enrollment where studentId=?`;
      let enrollments = await mysql.query(sql, [userId]);

      if (
        enrollments &&
        enrollments.length > 0 &&
        enrollments[0] !== undefined
      ) {
        let results = [];
        for (const en of enrollments) {
          sql = `select className, maxAttendancePossible from class where classId=?`;
          let classEntry = await mysql.query(sql, [en.classId]);
          console.log('classEntry', classEntry);
          sql = `select sectionName from section where sectionId=?`;
          let sectionName = await mysql.query(sql, [en.sectionId]);
          console.log('sectionName', sectionName);
          // TODO: add attendance table entries as part of the next step
          sql = `select count(*) from attendance where studentId=? and classId=? and sectionId=?`;
          let countResult = await mysql.query(sql, [
            en.studentId,
            en.classId,
            en.sectionId
          ]);
          let count = countResult ? countResult[0]['count(*)'] : 0;
          //if (countResult) count = countResult[0]['count(*)'];
          const attendancePercentage =
            (count / classEntry[0].maxAttendancePossible) * 100.0;
          const today = new Date().toISOString().slice(0, 10);

          sql = `select count(*) from attendance where studentId=? and classId=? and sectionId=? and dateOfAttendance=?`;
          let todayResult = await mysql.query(sql, [
            en.studentId,
            en.classId,
            en.sectionId,
            today
          ]);
          let todayCount = 0;

          if (
            todayResult &&
            todayResult.length > 0 &&
            todayResult[0] !== undefined
          )
            todayCount = todayResult[0]['count(*)'];
          const hasAttendedToday = todayCount == 0 ? false : true;
          results.push({
            classId: en.classId,
            className: classEntry[0].className,
            sectionId: en.sectionId,
            sectionName: sectionName[0].sectionName,
            attendancePercentage: Math.floor(attendancePercentage * 100) / 100,
            hasAttendedToday
          });
        }
        await mysql.end();
        return utils.createResponse(200, results);
      } else {
        await mysql.end();
        return utils.createResponse(400, 'No enrollments were found');
      }
    } else {
      await mysql.end();
      return utils.createResponse(400, 'No userId was given');
    }
  } catch (err) {
    return utils.createResponse(err.status, err);
  }
};

module.exports = { handler: fetchStudent };
