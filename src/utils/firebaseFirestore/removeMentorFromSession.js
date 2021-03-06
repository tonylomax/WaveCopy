import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {userHasPermission} from 'utils';

export default removeMentorFromSession = async (
  sessionID,
  userID,
  uid,
  sessionleadID,
  roles,
) => {
  const sessionReference = firestore().doc(`Sessions/${sessionID}`);

  console.log('userHasPermission', userHasPermission(roles));

  return await firestore()
    .runTransaction(async (removeMentorFromSessionTransaction) => {
      const sessionData = await removeMentorFromSessionTransaction.get(
        sessionReference,
      );
      const newMentors = sessionData
        .data()
        .mentors.filter((mentor) => mentor.id !== userID);

      console.log({newMentors});
      if (!sessionData.exists) {
        throw 'Session does not exist!';
      }
      if (userID === uid && !userHasPermission(roles)) {
        throw 'You cannot remove yourself as a mentor, please contact the coordinator to remove you';
      }
      if (sessionleadID === userID) {
        throw 'Remove this person from session lead before you remove them from session';
      } else {
        removeMentorFromSessionTransaction.update(sessionReference, {
          mentors: newMentors,
        });
      }
    })
    .then((result) => {
      console.log('REMOVE MENTOR FROM SESSION TRANSACTION COMPLETED');
      return result;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
