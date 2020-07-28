import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {updateSessions} from '../../redux/';

export default (sessionID) => {
  console.log('querying sessions');
  return firestore()
    .collection(COLLECTIONS.SESSIONS)
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
