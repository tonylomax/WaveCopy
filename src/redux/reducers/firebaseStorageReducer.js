import {ACTIONS} from 'constants';

export const initialState = {
  downloadURI: {},
};

export default (state = initialState, action) => {
  console.log('[REDUCER], firebaseStorageReducer');

  switch (action.type) {
    case ACTIONS.GET_PROFILE_PIC:
      console.log('[Reducer - Nav] GET_PROFILE_PIC', action.data);
      return {...state, downloadURI: action.data};
    default:
      return state;
  }
};
