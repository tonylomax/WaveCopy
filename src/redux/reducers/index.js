import {combineReducers} from 'redux';
import firestoreReducer from './firestoreReducer';
import authenticationReducer from './authenticationReducer';
import sessionsReducer from './sessionsReducer';
export default combineReducers({
  firestoreReducer,
  authenticationReducer,
  sessionsReducer,
});
