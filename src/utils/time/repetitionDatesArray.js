import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default (sessionDate, sessionTime, numberOfRepetitions) => {
  console.log({sessionDate});
  const day = moment(sessionDate).date();
  console.log({day});
  const month = moment(sessionDate).month();
  console.log({month});
  const year = moment(sessionDate).year();
  console.log({year});
  console.log({sessionTime});
  const hour = moment(sessionTime).hour();
  console.log({hour});
  const minutes = moment(sessionTime).minute();
  console.log({minutes});
  console.log({numberOfRepetitions});

  const startDateTime = moment()
    .year(year)
    .month(month)
    .date(day)
    .hour(hour)
    .minute(minutes)
    .seconds(0)
    .millisecond(0);

  console.log({startDateTime});

  const arrayOfTimes = [startDateTime];
  for (let i = 0; i < numberOfRepetitions; i++) {
    const Repetition = moment(startDateTime).add('days', 7 * (i + 1));
    console.log(Repetition);
    arrayOfTimes.push(Repetition);
  }
  console.log(arrayOfTimes);

  return arrayOfTimes;
};
