const moment = require('moment-timezone');

function getDate(){
    const dateVietnam = moment.tz(Date.now(), "Asia/Saigon");

    return dateVietnam;

}

module.exports = getDate()