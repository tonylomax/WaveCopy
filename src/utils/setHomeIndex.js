import store from '../redux/store';
import {updateHomeIndex} from '../redux/index';

export default setHomeIndex = (index) => {
  console.log('index in util', index);
  store.dispatch(updateHomeIndex(index));
};
