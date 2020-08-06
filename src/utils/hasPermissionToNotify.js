import {userHasPermission} from 'utils';

export default hasPermissionToNotify = ({
  roles,
  sessionLeadID,
  uid,
  daysUntilSession,
  maxMentors,
  currentNumberOfMentors,
}) => {
  return (
    (userHasPermission(roles) || sessionLeadID === uid) &&
    daysUntilSession < 2 &&
    daysUntilSession >= 0 &&
    maxMentors > currentNumberOfMentors
  );
};
