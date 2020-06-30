import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import combineDateAndTime from './combineDateAndTime';

// The goal of this function is to generate the combined time
export default (sessionDate, sessionTime, numberOfRepetitions) => {
  // Get combined datetime
  const startDateTime = combineDateAndTime(sessionDate, sessionTime);

  // Initialise the array with start datetime
  const arrayOfTimes = [startDateTime];
  // Loop through the array depending on the number of repetitions
  // If reps are 0 then just return the start datetime
  for (let i = 0; i < numberOfRepetitions; i++) {
    const Repetition = moment(startDateTime).add(7 * (i + 1), 'days');
    arrayOfTimes.push(Repetition);
  }
  return arrayOfTimes;
};
