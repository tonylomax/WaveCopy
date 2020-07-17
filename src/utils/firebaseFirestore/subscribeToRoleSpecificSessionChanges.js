import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {updateRoleSpecificSessions} from '../../redux/';

export default (userRegion) => {
  console.log('creating a subscription role role based sessions');
  return firestore()
    .collection(COLLECTIONS.SESSIONS)
    .where('RegionID', '==', userRegion)
    .onSnapshot(
      (roleSpecificSessions) => {
        console.log('inside on snapshot, received some data');
        const sessionsData = roleSpecificSessions.docs.map((session) => {
          console.log('session in subscriptions', session);
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
        store.dispatch(updateRoleSpecificSessions(sessionsData));
      },
      (error) => {
        console.error(error);
      },
    );
};
