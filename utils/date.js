// const moment = require('moment-timezone');
const moment = require('moment');

function getDate(){
    // const dateVietnam = moment.tz(Date.now(), "Asia/Saigon");
    // const newDate = new moment().utc(new Date)
    // return moment.utc(Date.now());
    return moment();

}

module.exports = getDate()