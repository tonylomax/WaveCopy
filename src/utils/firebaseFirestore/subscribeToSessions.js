import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {updateSessions} from '../../redux/';
import moment from 'moment';
moment.locale('en-gb');
moment().format('en-gb');
import 'moment/src/locale/en-gb';

export default (sessionID) => {
  console.log('querying sessions');
  const sixMonthsAgo = moment(new Date()).subtract(6, 'months').format();

  return firestore()
    .collection(COLLECTIONS.SESSIONS)
    .where('dateTime', '>', sixMonthsAgo)
    .onSnapshot(
      (sessionData) => {
        // console.log('sessionData', sessionData);

        const sessionsData = sessionData.docs.map((session) => {
          return {
            id: session?._ref?._documentPath?._parts[1],
            beachID: session?._data?.beachID,
            beach: session?._data?.beach,
            dateTime: session?._data?.dateTime,
            time: session?._data?.time,
            description: session?._data?.description,
            attendeesIDandAttendance: session?._data?.attendees,
            coordinatorID: session?._data?.coordinatorID,
            maxMentors: session?._data?.maxMentors,
            type: session?._data?.type,
            mentors: session?._data?.mentors,
          };
        });
        store.dispatch(updateSessions(sessionsData));
      },
      (error) => {
        console.error(error);
      },
    );
};
