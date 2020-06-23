export const initialState = {};
import {ACTIONS} from '../../constants/actions';

export default (state = initialState, action) => {
  console.log('[REDUCER], firestorereducer');
  switch (action.type) {
    case ACTIONS.SUBSCRIBE_TO_SESSIONS:
      console.log(
        '[Reducer - fireStoreReducer] SUBSCRIBE TO SESSIONS',
        action.data,
      );

      return {...state, action};

    default:
      return state;
  }
};
