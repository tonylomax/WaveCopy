import {ROLES} from 'constants';

export default userHasRoles = (userRoles) => {
  const result = ROLES.filter((role) => userRoles?.includes(role));
  if (result.length > 0) {
    return true;
  } else return false;
};
