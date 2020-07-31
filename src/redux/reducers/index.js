import {combineReducers} from 'redux';
import firestoreReducer from './firestoreReducer';
import authenticationReducer from './authenticationReducer';
import navigationReducer from './navigationReducer';
import firebaseStorageReducer from './firebaseStorageReducer'
export default combineReducers({
  firestoreReducer,
  authenticationReducer,
  navigationReducer,
  firebaseStorageReducer
});
