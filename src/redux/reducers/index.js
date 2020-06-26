import {combineReducers} from 'redux';
import firestoreReducer from './firestoreReducer';
import authenticationReducer from './authenticationReducer';
export default combineReducers({firestoreReducer, authenticationReducer});


