import {combineReducers} from 'redux';
import firestoreReducer from './firestoreReducer';
import authenticationReducer from './authenticationReducer';
import navigationReducer from './navigationReducer';
export default combineReducers({
  firestoreReducer,
  authenticationReducer,
  navigationReducer,
});
