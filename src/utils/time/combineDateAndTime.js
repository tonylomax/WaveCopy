import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

// The goal of this function is to take two datetimes:
// 1 - Session Date - correct date but incorrect time
// 2 - Session time - correct time but incorrect date
// And combine them to be one correct datetime
export default (sessionDate, sessionTime) => {
  // Get the constituent parts from each datetime
  const day = moment(sessionDate).date();
  const month = moment(sessionDate).month();
  const year = moment(sessionDate).year();
  const hour = moment(sessionTime).hour();
  const minutes = moment(sessionTime).minute();

  // Combine them into one datetime
  // Always setting seconds and milliseconds to 0
  const startDateTime = moment()
    .year(year)
    .month(month)
    .date(day)
    .hour(hour)
    .minute(minutes)
    .seconds(0)
    .millisecond(0);
  return startDateTime;
};
