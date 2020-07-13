import store from '../../redux/store/index';
import {ROLES} from 'constants';

export default userHasRoles = (role) => {
  const userRoles = store.getState().firestoreReducer.userData.Roles;
  return userRoles.includes(role);
};
