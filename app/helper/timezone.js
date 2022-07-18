var Moment = require('moment-timezone');

const currentDate = (format) => {
    return Moment().tz('Asia/Kolkata').format(format)
}

const currentTime = (format) => {
    return Moment().tz('Asia/Kolkata').format(format)
}

const addTime = (type, time, format) => {
    return Moment().tz('Asia/Kolkata').add(type, time).format(format)
}
const addTime1 = (date, type, time, format) => {
    return Moment(date).tz('Asia/Kolkata').add(type, time).format(format)
}

const subtractTime = (type, time, format) => {
    return Moment().tz('Asia/Kolkata').subtract(type, time).format(format)
}

const DiffTime = (date1, date2, type) => {
    var dateB = Moment(date1).tz('Asia/Kolkata')
    var dateC = Moment(date2).tz('Asia/Kolkata')
    return dateB.diff(dateC, type);
}

const timestamp = (date) => {
  return Moment(date).tz('Asia/Kolkata').unix()
}
const Currenttimestamp = () => {
  return Moment().tz('Asia/Kolkata').unix()
}
const timestamps = (date, type, time) => {
  return Moment(date).tz('Asia/Kolkata').subtract(360, time)
}
const Currenttimestamps = () => {
  return Moment().tz('Asia/Kolkata')
}
const changeFormat = (date, format) => {
  return Moment(date).tz('Asia/Kolkata').format(format)
}

const GetDaystring = (day) => {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[day]
}


module.exports = {
    currentDate,
    currentTime,
    addTime,
    subtractTime,
    DiffTime,
    timestamp,
    changeFormat,
    addTime1,
    Currenttimestamp,
    GetDaystring,
    timestamps,
    Currenttimestamps
}