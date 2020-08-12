import firestore from '@react-native-firebase/firestore';
import {userHasPermission} from 'utils';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default removeSelfFromSession = async (
  sessionID,
  userID,
  sessionLeadID,
  roles,
) => {
  console.log('roles in remove self from session', roles);
  const sessionReference = firestore().doc(`Sessions/${sessionID}`);

  return await firestore()
    .runTransaction(async (removeFromSessionTransaction) => {
      const sessionData = await removeFromSessionTransaction.get(
        sessionReference,
      );
      const newMentors = sessionData
        .data()
        .mentors.filter((mentor) => mentor.id !== userID);
      console.log({newMentors});
      const hoursUntilSession = moment
        .duration(moment(sessionData.data().dateTime).diff(new Date()))
        .asHours();

      if (!sessionData.exists) {
        throw 'Session does not exist!';
      } else if (hoursUntilSession <= 48 && !userHasPermission(roles)) {
        throw 'It is less than 48 hours till this session begins, please contact the coordinator directly to request removal from session';
      } else if (
        sessionData.data().mentors.filter((mentor) => mentor.id === userID)
          .length !== 1
      ) {
        throw 'You are not signed up for this session';
      } else if (userID === sessionLeadID) {
        throw 'You are set as the session lead for this session, if you wish to leave please contact the coordinator to remove you';
      } else {
        removeFromSessionTransaction.update(sessionReference, {
          mentors: newMentors,
        });
      }
    })
    .then((result) => {
      console.log('REMOVE SELF FROM SESSION TRANSACTION COMPLETED', result);
      return result;
    })
    .catch((err) => {
      console.log('ERROR INSIDE TRANSACTION', err);
      throw err;
    });
};
