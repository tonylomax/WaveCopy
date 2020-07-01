import firestore from '@react-native-firebase/firestore';

export default (searchTerm) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('searching for matches from ', searchTerm);
      resolve('matches found');
    } catch (err) {
      reject(err);
    }
  });
};
