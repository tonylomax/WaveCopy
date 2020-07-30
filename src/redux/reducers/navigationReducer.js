import {ACTIONS} from 'constants';

export const initialState = {
  index: {},
};

export default (state = initialState, action) => {
  console.log('[REDUCER], navigationReducer');

  switch (action.type) {
    case ACTIONS.SET_HOME_INDEX:
      console.log('[Reducer - Nav] SET_HOME_INDEX', action.data);
      return {...state, index: action.data};
    default:
      return state;
  }
};
