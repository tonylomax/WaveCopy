import {ACTIONS} from '../../constants/actions';

export const initialState = {
  userState: {},
  roles: {roles: ['SurfMentor', 'Coordinator', 'NationAdmin']},
};

export default (state = initialState, action) => {
  console.log('[REDUCER], authenticationReducer');

  switch (action.type) {
    case ACTIONS.SET_CURRENT_AUTHENTICATED_USER:
      console.log('[Reducer - AuthUser] SET_CURRENT_AUTHENTICATED_USER');
      const userState = action.data;
      return {...state, userState};
    default:
      return state;
  }
};
