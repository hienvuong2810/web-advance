const moment = require('moment-timezone');

function getDate(){
    const dateVietnam = moment.tz(Date.now(), "Asia/Saigon");

    return Date.now();

}

module.exports = getDate()