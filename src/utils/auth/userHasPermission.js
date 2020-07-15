import {ROLES} from 'constants';

export default userHasPermission = (userRoles) => {
  const filterResult = ROLES.filter((role) => userRoles?.includes(role));
  if (filterResult.length > 0) {
    return true;
  } else return false;
};
