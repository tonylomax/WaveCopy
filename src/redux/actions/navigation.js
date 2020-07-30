import {ACTIONS} from 'constants';

export function updateHomeIndex(index) {
  console.log('[Action] setHomeIndex', index);
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.SET_HOME_INDEX,
      data: index,
    });
  };
}
