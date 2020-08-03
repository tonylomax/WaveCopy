import {ACTIONS} from 'constants';

export function getProfilePicture(downloadURI) {
  console.log('[Action] getProfilePicture', downloadURI);
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.GET_PROFILE_PIC,
      data: downloadURI,
    });
  };
}
