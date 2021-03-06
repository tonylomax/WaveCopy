import {ACTIONS} from 'constants';

export const initialState = {
  userState: {},
};

export default (state = initialState, action) => {
  console.log('[REDUCER], authenticationReducer');

  switch (action.type) {
    case ACTIONS.SET_CURRENT_AUTHENTICATED_USER:
      console.log(
        '[Reducer - AuthUser] SET_CURRENT_AUTHENTICATED_USER',
        action.data,
      );
      const userState = action.data;
      return {...state, userState};
    default:
      return state;
  }
};
