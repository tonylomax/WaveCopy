// React/React components
import React, {useEffect, useState} from 'react';
import {View, Text, Alert, ImageBackground, ScrollView} from 'react-native';
import {
  SessionDetailsAccordionMenu,
  ConfirmButton,
  CloseButton,
} from 'components';
import {
  Card,
  Title,
  Divider,
  Paragraph,
  Portal,
  Modal,
  IconButton,
  useTheme,
  Chip,
} from 'react-native-paper';

// Firebase
import {firebase} from '@react-native-firebase/functions';
const functions = firebase.functions();
// Redux
import {useSelector, useDispatch} from 'react-redux';
import {
  clearSelectedSessionMentors,
  clearSelectedSessionAttendees,
  clearCurrentSession,
} from '../../redux/';
// React Navigation
import {CommonActions} from '@react-navigation/native';
// Moment
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
// Assets
import {coverWave} from '../../assets/';
// Utils
import {
  subscribeToSessionChanges,
  signupForSession,
  retrieveCoordinatorData,
  removeSelfFromSession,
  deleteSession,
  userHasPermission,
  hasPermissionToNotify,
  subscribeToCurrentSessionAttendees,
} from 'utils';
import {startCase} from 'lodash';
// Constants
import {COLLECTIONS} from 'constants';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  // If coming from home, there is an item field,
  const {colors} = useTheme();

  // Extract data differently depending on where navigated from
  const {id, attendeesIDandAttendance, mentors, maxMentors} = route?.params
    ?.item
    ? route?.params?.item
    : route?.params?.session;

  const {selectedBeach} = route.params;

  //REDUX STATE
  // Data on the session
  const sessionData = useSelector(
    (state) => state.firestoreReducer?.singleSession,
  );

  const sessionDataMentors = useSelector(
    (state) => state.firestoreReducer?.singleSession?.mentors,
  );
  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionSubscribedAttendees,
  );

  const selectedSessionMentorsData = useSelector(
    (state) => state.firestoreReducer.selectedSessionSubscribedMentors,
  );

  const sessionLeadID = useSelector(
    (state) => state.firestoreReducer?.singleSession?.sessionLead?.id,
  );

  // Current Auth User
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  const userData = useSelector((state) => state.firestoreReducer.userData);

  const roles = useSelector((state) => state.firestoreReducer.userData.roles);

  // const {roles} = useSelector((state) => state.authenticationReducer.roles);

  //LOCAL STATE
  const [coordinator, setCoordinator] = useState();
  const [surfLead, setSurfLead] = useState();
  const [CoverImage, setCoverImage] = useState(coverWave);
  const [daysUntilSession, setDaysUntilSession] = useState(0);
  const [deleteSessionModalVisible, setDeleteSessionModalVisible] = useState(
    false,
  );

  const toggleDeleteSessionModal = () =>
    setDeleteSessionModalVisible(
      (deleteSessionModalVisible) => !deleteSessionModalVisible,
    );

  useEffect(() => {
    // Set up subscription for all the session data
    const unsubscribeFromSessionChanges = subscribeToSessionChanges(id);
    return () => {
      console.log('CALLING clearSelectedSessionMentors');
      dispatch(clearSelectedSessionMentors());
      dispatch(clearSelectedSessionAttendees());
      dispatch(clearCurrentSession());
      console.log('FINISHED CALLING clearSelectedSessionMentors');
      unsubscribeFromSessionChanges();
    };
  }, []);

  useEffect(() => {
    // Set up subscription for all the data relating to the mentors in a session
    console.log(
      'creating a subscription to subscribeToCurrentSessionAttendees',
      sessionData?.mentors,
      COLLECTIONS.USERS,
    );
    const mentorsUnsubscribers = subscribeToCurrentSessionAttendees(
      sessionData?.mentors,
      COLLECTIONS.USERS,
    );
    // Set up subscription for all the data relating to the attendees in a session
    const serviceUsersUnsubscribers = subscribeToCurrentSessionAttendees(
      sessionData?.attendees,
      COLLECTIONS.TEST_SERVICE_USERS,
    );

    return () => {
      console.log('unsubscribing');
      mentorsUnsubscribers?.forEach((unsubscribe) => {
        console.log(' mentor unsubscribe called');
        unsubscribe();
      });
      serviceUsersUnsubscribers?.forEach((unsubscribe) => {
        console.log('service user unsubscribe called');
        unsubscribe();
      });
    };
  }, [sessionDataMentors]);

  useEffect(() => {
    setDaysUntilSession(moment(sessionData?.dateTime).diff(new Date(), 'days'));
    retrieveCoordinatorData(sessionData?.coordinatorID)
      .then((coordinatorData) => setCoordinator(coordinatorData))
      .catch((err) => clg(err));
    if (userHasPermission(userData?.roles) || sessionLeadID === uid) {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            color="white"
            icon="square-edit-outline"
            size={36}
            onPress={() => {
              navigation.push('SessionDetails', {
                previousSessionData: sessionData,
                previouslySelectedAttendees: selectedSessionAttendeesData,
                previouslySelectedMentors: selectedSessionMentorsData,
                previousSessionID: id,
              });
            }}></IconButton>
        ),
      });
    }
  }, [sessionData]);

  useEffect(() => {
    const SURFLEAD = selectedSessionMentorsData?.find(
      (mentor) => mentor.id === sessionLeadID,
    );
    setSurfLead(SURFLEAD);
  }, [selectedSessionMentorsData]);

  const leaveSession = (id, uid, sessionLeadID) => {
    removeSelfFromSession(id, uid, sessionLeadID, roles)
      .then((result) => {
        console.log('Session remove done');
        console.log('leaving session', selectedSessionMentorsData);
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        Alert.alert(err);
      });
  };

  return (
    <ScrollView bounces={false}>
      <View>
        <ImageBackground
          style={{height: 175, width: '100%'}}
          source={CoverImage}>
          {/* Edit session button */}
        </ImageBackground>

        <View>
          {hasPermissionToNotify({
            roles: userData?.roles,
            sessionLeadID,
            uid,
            daysUntilSession,
            maxMentors: sessionData?.maxMentors,
            currentNumberOfMentors: sessionDataMentors?.length,
          }) && (
            <ConfirmButton
              onPress={() => {
                const sendNotificationToAllMentorsInSameRegionAsSession = functions.httpsCallable(
                  'sendNotificationToAllMentorsInSameRegionAsSession',
                );
                console.log(sendNotificationToAllMentorsInSameRegionAsSession);
                sendNotificationToAllMentorsInSameRegionAsSession({
                  sessionData,
                })
                  .then(function (result) {
                    Alert.alert(
                      `Sent to ${result?.data?.successCount} mentors`,
                    );
                  })
                  .catch(function (error) {
                    // Getting the Error details.
                    console.log('error back from the function', error);
                    Alert(
                      'There was an error sending your notifications, please try again later.',
                      error,
                    );
                    const {code, message, details} = error;
                    clg(code, message, details);
                    // ...
                  });
              }}
              title="Notify mentors"
            />
          )}

          <Paragraph style={{alignSelf: 'center'}}>
            <Moment element={Text} format="LLLL">
              {sessionData?.dateTime}
            </Moment>
          </Paragraph>
          <Divider
            style={{
              width: '50%',
              alignSelf: 'center',
              borderWidth: 1,
              borderRadius: 10,
            }}
          />

          {/* Session beach  */}
          <Paragraph style={{alignSelf: 'center'}}>
            {startCase(sessionData?.type?.replace(/-/gi, ' '))}-
            {sessionData?.beach?.replace(/-/gi, ' ')}
          </Paragraph>

          {/* Cover coordinator */}

          <Title style={{alignSelf: 'center'}}>Coordinator</Title>
          <Paragraph style={{alignSelf: 'center', marginBottom: '3%'}}>
            {' '}
            {coordinator?.firstName} {coordinator?.lastName}
          </Paragraph>

          {/* Show if session is full */}
          {maxMentors === selectedSessionMentorsData.length && (
            <Chip
              style={{
                alignSelf: 'center',
                marginBottom: '3%',
              }}
              mode="outlined"
              icon="information"
              onPress={() => console.log('Pressed')}>
              This session is full
            </Chip>
          )}
          {/* Session description */}
          <Paragraph style={{marginLeft: '3%'}}>
            Description: {sessionData?.description}
          </Paragraph>
          {/* Session Accordion menu for attendees */}

          {/* Session date/time */}

          {/* Session Lead */}
          {!sessionLeadID || sessionLeadID === '' ? (
            <Paragraph style={{marginLeft: '3%'}}>
              Session Lead: No session lead
            </Paragraph>
          ) : sessionLeadID === uid ? (
            <Paragraph style={{marginLeft: '3%'}}>
              Session Lead: You are the session lead
            </Paragraph>
          ) : (
            <Paragraph style={{marginLeft: '3%'}}>
              Session Lead: {surfLead?.firstName} {surfLead?.lastName} is the
              session lead
            </Paragraph>
          )}

          {selectedSessionAttendeesData?.length >= 0 &&
            selectedBeach &&
            maxMentors > 0 &&
            selectedSessionMentorsData?.length >= 0 && (
              <SessionDetailsAccordionMenu
                selectedUsers={selectedSessionAttendeesData}
                numberOfMentors={maxMentors}
                location={selectedBeach}
                mentors={selectedSessionMentorsData}
                navigation={navigation}
                route={route}
                sessionLead={sessionData?.sessionLead}
                sessionID={id}
                roles={roles}
              />
            )}

          <Card
            style={{
              padding: '0%',
              margin: '1%',
              marginBottom: '10%',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Card.Actions
              style={{
                width: '100%',
                alignSelf: 'center',
                alignContent: 'center',
                justifyContent:
                  userHasPermission(userData?.roles) || sessionLeadID === uid
                    ? 'space-around'
                    : 'space-between',
              }}>
              {/* REGISTER BUTTON */}
              {(userHasPermission(userData?.roles) ||
                sessionLeadID === uid) && (
                <ConfirmButton
                  compact={true}
                  title="Attendance List"
                  testID="registerButton"
                  onPress={() => {
                    navigation.navigate('Register', {
                      id,
                    });
                  }}>
                  Register
                </ConfirmButton>
              )}

              {/* LEAVE/SIGNUP */}
              {/* Only show if signup button if user is in the session, otherwise show signup button */}
              {selectedSessionMentorsData.some(
                (mentor) => mentor.id === uid,
              ) ? (
                <ConfirmButton
                  compact={true}
                  testID="leaveSessionButton"
                  title="Leave session"
                  onPress={() => {
                    leaveSession(id, uid, sessionLeadID);
                  }}></ConfirmButton>
              ) : (
                <ConfirmButton
                  compact={true}
                  testID="signupButton"
                  title="Sign Up"
                  disabled={maxMentors === selectedSessionMentorsData.length}
                  onPress={() => {
                    signupForSession(id, uid)
                      .then((result) => {
                        console.log('Session signup done ');
                      })
                      .catch((err) => {
                        console.log('ERROR: ', err);
                      });
                  }}></ConfirmButton>
              )}
              {/* DElETE SESSION */}
              {userHasPermission(userData?.roles) && (
                <CloseButton
                  compact={true}
                  title="Delete"
                  testID="delete-session-button"
                  onPress={() => toggleDeleteSessionModal()}>
                  Register
                </CloseButton>
              )}
              {/* Popup to confirm delete session */}
            </Card.Actions>
          </Card>

          <Portal>
            <Modal
              visible={deleteSessionModalVisible}
              onDismiss={toggleDeleteSessionModal}>
              <Card>
                <Card.Title
                  titleStyle={{alignSelf: 'center', fontSize: 18}}
                  title="Are you sure you want to delete this session?"
                />
                <Card.Content
                  style={{
                    justifyContent: 'space-around',
                  }}>
                  <ConfirmButton
                    title="Yes"
                    onPress={() => {
                      console.log('deleting session');
                      deleteSession(id, uid)
                        .then((res) => {
                          console.log('deleted session res', res);
                          const RouteDestination =
                            route.name === 'HomeSession' ? 'Home' : 'Profile';
                          console.log('route destination ', RouteDestination);
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{name: RouteDestination}],
                            }),
                          );
                        })
                        .catch((err) =>
                          console.log('error deleting session', err),
                        );
                    }}></ConfirmButton>
                  <CloseButton
                    title="No"
                    onPress={() => {
                      toggleDeleteSessionModal();
                    }}></CloseButton>
                </Card.Content>
              </Card>
            </Modal>
          </Portal>
        </View>
      </View>
    </ScrollView>
  );
}
