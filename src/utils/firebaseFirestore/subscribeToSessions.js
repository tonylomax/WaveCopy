import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {updateSessions} from '../../redux/';

export default (sessionID) => {
  return firestore()
    .collection(COLLECTIONS.SESSIONS)
    .onSnapshot(
      (sessionData) => {
        const sessionsData = sessionData.docs.map((session) => {
          // console.log('session?._data?.Mentors ', session?._data?.Mentors);
          return {
            ID: session?._ref?._documentPath?._parts[1],
            BeachID: session?._data?.BeachID,
            Beach: session?._data?.Beach,
            DateTime: session?._data?.DateTime,
            Time: session?._data?.Time,
            Description: session?._data?.Description,
            AttendeesIDandAttendance: session?._data?.Attendees,
            CoordinatorID: session?._data?.CoordinatorID,
            MaxMentors: session?._data?.MaxMentors,
            Type: session?._data?.Type,
            Mentors: session?._data?.Mentors,
          };
        });
        store.dispatch(updateSessions(sessionsData));
      },
      (error) => {
        console.error(error);
      },
    );
};
