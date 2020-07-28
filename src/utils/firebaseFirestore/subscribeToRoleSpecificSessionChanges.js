import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {updateRoleSpecificSessions} from '../../redux/';

export default (userRegion) => {
  console.log('creating a subscription role role based sessions');
  return firestore()
    .collection(COLLECTIONS.SESSIONS)
    .where('regionID', '==', userRegion)
    .onSnapshot(
      (roleSpecificSessions) => {
        console.log('inside on snapshot, received some data');
        const sessionsData = roleSpecificSessions.docs.map((session) => {
          console.log('session in subscriptions', session);
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
        store.dispatch(updateRoleSpecificSessions(sessionsData));
      },
      (error) => {
        console.error(error);
      },
    );
};
