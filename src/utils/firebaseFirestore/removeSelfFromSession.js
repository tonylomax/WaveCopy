import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import 'moment/src/locale/en-gb';
import {constant} from 'lodash';
moment.locale('en-gb');
moment().format('en-gb');

export default removeSelfFromSession = async (sessionID, userID) => {
  return new Promise(async (resolve, reject) => {
    const sessionReference = firestore().doc(`Sessions/${sessionID}`);

    firestore()
      .runTransaction(async (removeFromSessionTransaction) => {
        const sessionData = await removeFromSessionTransaction.get(
          sessionReference,
        );

        const newMentors = sessionData
          .data()
          .Mentors.filter((mentor) => mentor.id !== userID);

        console.log('newMentors', newMentors);

        const hoursUntilSession = moment
          .duration(moment(sessionData.data().DateTime).diff(new Date()))
          .asHours();

        if (!sessionData.exists) {
          reject('Session does not exist!');
        } else if (hoursUntilSession <= 48) {
          reject(
            'It is less than 48 hours till this session begins, please contact the coordinator directly to request removal from session',
          );
        } else if (
          sessionData.data().Mentors.filter((mentor) => mentor.id === userID)
            .length !== 1
        ) {
          reject('You are not signed up for this session');
        } else {
          removeFromSessionTransaction.update(sessionReference, {
            Mentors: newMentors,
          });
        }
      })
      .then(() => resolve('REMOVE SELF FROM SESSION TRANSACTION COMPLETED'))
      .catch((err) => {
        reject(err);
      });
  });
};