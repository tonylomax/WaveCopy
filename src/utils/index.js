import {
  loginWithEmail,
  signOut,
  updatePassword,
  validatePassword,
  createAuthSubscription,
  userHasPermission,
  validateEmail,
} from './auth/index';
import {
  addNotificationToken,
  requestNotificationPermission,
} from './pushNotifications/index';
import {
  updateOwnBio,
  subscribeToCurrentSessionAttendees,
  markAttendance,
  searchFirestoreServiceUsers,
  createSessionInFirestore,
  subscribeToSessionChanges,
  subscribeToSessions,
  subscribeToFirestoreUsers,
  subscribeToRoleSpecificSessionChanges,
  signupForSession,
  retrieveCoordinatorData,
  removeSelfFromSession,
  assignSessionLead,
  unassignSessionLead,
  deleteSession,
  removeMentorFromSession,
  updateOwnContactNumber,
  updateSessionInFirestore,
  toggleIsNewUser,
  retrieveRegions,
  updateOwnRegion,
} from './firebaseFirestore/index';
import {
  getImageDownloadURI,
  simplyGetImageDownloadURI,
  uploadFile,
  monitorFileUpload,
  uploadProgress,
} from './firebaseStorage/index';
import generateDateTimeArray from './time/repetitionDatesArray';
import getCoverImage from './getCoverImage';
import generateNumberedArray from './generateNumberedArray';
import getSessionLeadName from './getSessionLeadName';
import setHomeIndex from './setHomeIndex';
import hasPermissionToNotify from './hasPermissionToNotify';
export {
  hasPermissionToNotify,
  simplyGetImageDownloadURI,
  getSessionLeadName,
  updateSessionInFirestore,
  deleteSession,
  assignSessionLead,
  unassignSessionLead,
  createAuthSubscription,
  createSessionInFirestore,
  searchFirestoreServiceUsers,
  subscribeToSessions,
  subscribeToSessionChanges,
  subscribeToFirestoreUsers,
  loginWithEmail,
  signOut,
  updateOwnBio,
  getImageDownloadURI,
  uploadFile,
  monitorFileUpload,
  uploadProgress,
  updatePassword,
  validatePassword,
  subscribeToCurrentSessionAttendees,
  markAttendance,
  getCoverImage,
  generateDateTimeArray,
  generateNumberedArray,
  subscribeToRoleSpecificSessionChanges,
  signupForSession,
  retrieveCoordinatorData,
  removeSelfFromSession,
  removeMentorFromSession,
  updateOwnContactNumber,
  userHasPermission,
  toggleIsNewUser,
  retrieveRegions,
  updateOwnRegion,
  addNotificationToken,
  requestNotificationPermission,
  setHomeIndex,
  validateEmail,
};
