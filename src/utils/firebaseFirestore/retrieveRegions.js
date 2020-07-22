import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {getRegions} from '../../redux/index';

export default retrieveRegions = () => {
  return firestore()
    .collection(COLLECTIONS.REGIONS)
    .get()
    .then((regions) => {
      let updatedRegions = [];
      regions.forEach((region) => {
        console.log('region', region.id, region.data());
        updatedRegions.push({
          Name: region.data().Name,
          ID: region.id,
        });
      });
      return updatedRegions;
    })
    .then((updatedRegions) => {
      console.log('updatedRegions', updatedRegions);
      store.dispatch(getRegions(updatedRegions));
    });
};
