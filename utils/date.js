// const moment = require('moment-timezone');
const moment = require('moment');

function getDate(){
    moment().local();
    // const dateVietnam = moment.tz(Date.now(), "Asia/Saigon");
    const newDate = moment().utc(Date.now())
    // return moment.utc(Date.now());
    return newDate;

}

module.exports = getDate()