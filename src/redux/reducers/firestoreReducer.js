export const initialState = {};

export default (state = initialState, action) => {
  console.log('[REDUCER], firestorereducer');
  switch (action.type) {
    //case ACTIONS.CREATE_NEW_FIRESTORE_USER:
    case 'subscribe':
      console.log('[Reducer - fireStoreReducer] SUBSCRIBE TO SESSIONS');
      console.log(action.data);
      return state;

    default:
      return state;
  }
};
