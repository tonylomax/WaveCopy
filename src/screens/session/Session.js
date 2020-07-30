import React, {useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/functions';
const functions = firebase.functions();
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  SessionDetailsAccordionMenu,
  ConfirmButton,
  CloseButton,
  LoadingScreen,
} from 'components';
import {Edit_Icon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import {serializeError} from 'serialize-error';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {coverWave} from '../../assets/';
import {
  getAllSessionAttendees,
  getAllSessionMentors,
  clearSelectedSessionMentors,
  clearSelectedSessionAttendees,
  clearCurrentSession,
} from '../../redux/';
import {
  subscribeToSessionChanges,
  signupForSession,
  retrieveCoordinatorData,
  removeSelfFromSession,
  deleteSession,
  userHasPermission,
  updateCurrentSessionAttendees,
  getSessionLeadName,
  getCoverImage,
} from 'utils';

import {
  Card,
  Title,
  Divider,
  Paragraph,
  Button,
  Portal,
  Modal,
  IconButton,
} from 'react-native-paper';
import {COLLECTIONS} from 'constants';
import {startCase} from 'lodash';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  // If coming from home, there is an item field,
  const {id, attendeesIDandAttendance, mentors, maxMentors} = route?.params
    ?.item
    ? route?.params?.item
    : route?.params?.session;

  const {selectedBeach} = route.params;

  // useEffect(() => {
  //   console.log('selectedBeach in session', selectedBeach);
  // }, [selectedBeach]);

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
  const {roles} = useSelector((state) => state.authenticationReducer.roles);

  //LOCAL STATE
  const [coordinator, setCoordinator] = useState();
  const [visible, setVisible] = useState(false);
  const [surfLead, setSurfLead] = useState();
  const IS_ADMIN =
    userData?.roles?.includes('SurfLead') ||
    userData?.roles?.includes('NationalAdmin') ||
    userData?.roles?.includes('Coordinator');
  const [CoverImage, setCoverImage] = useState();
  const [daysUntilSession, setDaysUntilSession] = useState(0);

  const [deleteSessionModalVisible, setDeleteSessionModalVisible] = useState(
    false,
  );

  const toggleDeleteSessionModal = () =>
    setDeleteSessionModalVisible(
      (deleteSessionModalVisible) => !deleteSessionModalVisible,
    );

  //LOCAL STATE

  useEffect(() => {
    setCoverImage(coverWave);
  }, []);

  useEffect(() => {
    // console.log('sessionData', sessionData);
    // console.log('sessionData', sessionData?.mentors);
    // console.log('MENTORS', Mentors);
    // console.log('selectedSessionMentorsData', selectedSessionMentorsData);
    // Set up subscription for all the data relating to the mentors in a session
    const mentorsUnsubscribers = updateCurrentSessionAttendees(
      sessionData?.mentors,
      COLLECTIONS.USERS,
    );
    // Set up subscription for all the data relating to the attendees in a session
    const serviceUsersUnsubscribers = updateCurrentSessionAttendees(
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
    // Set up subscription for all the session data

    const unsubscribe = subscribeToSessionChanges(id);

    return () => {
      console.log('CALLING clearSelectedSessionMentors');
      dispatch(clearSelectedSessionMentors());
      dispatch(clearSelectedSessionAttendees());
      dispatch(clearCurrentSession());
      console.log('FINISHED CALLING clearSelectedSessionMentors');
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setDaysUntilSession(moment(sessionData?.dateTime).diff(new Date(), 'days'));
    const SURFLEAD = selectedSessionMentorsData?.filter(
      (mentor) => mentor.id === sessionLeadID,
    );

    setSurfLead(SURFLEAD[0]);
  }, [selectedSessionMentorsData, sessionData]);

  useEffect(() => {
    // console.log('sessionData', sessionData);
    (async () => {
      setCoordinator(await retrieveCoordinatorData(sessionData?.coordinatorID));
    })();
    if (userHasPermission(userData?.roles) || sessionLeadID === uid) {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            color="white"
            icon="square-edit-outline"
            size={36}
            onPress={() => {
              console.log('navigating to session details');
              console.log({sessionData});
              console.log({selectedSessionAttendeesData});
              console.log({selectedSessionMentorsData});
              console.log({id});
              console.log('route name ', route.name);
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

  const leaveSession = (id, uid, sessionLeadID) => {
    removeSelfFromSession(id, uid, sessionLeadID)
      .then((result) => {
        console.log('Session remove done');
        // navigation.goBack();
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        Alert.alert(err);
      });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <ImageBackground
            style={{height: 175, width: '100%'}}
            source={CoverImage}>
            {/* Edit session button */}
          </ImageBackground>

          <View>
            {(userHasPermission(userData?.roles) || sessionLeadID === uid) &&
              daysUntilSession < 2 &&
              daysUntilSession >= 0 &&
              sessionData?.maxMentors - sessionDataMentors?.length > 0 && (
                <ConfirmButton
                  onPress={() => {
                    const sendNotificationToAllMentorsInSameRegionAsSession = functions.httpsCallable(
                      'sendNotificationToAllMentorsInSameRegionAsSession',
                    );
                    console.log(
                      sendNotificationToAllMentorsInSameRegionAsSession,
                    );
                    sendNotificationToAllMentorsInSameRegionAsSession({
                      sessionData,
                    })
                      .then(function (result) {
                        // Read result of the Cloud Function.
                        console.log(result);
                        // Note it actually gives you the number of devices it's sent to, but
                        // I think mentors is clearer.
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
                        const code = error.code;
                        console.log({code});
                        const message = error.message;
                        console.log({message});
                        const details = error.details;
                        console.log({details});
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
            <Paragraph style={{alignSelf: 'center'}}>
              {' '}
              {coordinator?.firstName} {coordinator?.lastName}
            </Paragraph>

            {/* Session description */}
            <Paragraph>{sessionData?.description}</Paragraph>
            {/* Session Accordion menu for attendees */}

            {/* Show if session is full */}
            {maxMentors === selectedSessionMentorsData.length && (
              <Text>This session is full</Text>
            )}
            {/* Session date/time */}

            {/* Session Lead */}
            {!sessionLeadID || sessionLeadID === '' ? (
              <Text>No session lead</Text>
            ) : sessionLeadID === uid ? (
              <Text>You are the session lead</Text>
            ) : (
              <Text>
                {surfLead?.firstName} {surfLead?.lastName} is the session lead
              </Text>
            )}

            {selectedSessionAttendeesData &&
              selectedBeach &&
              maxMentors > 0 &&
              selectedSessionMentorsData && (
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

            <Card style={{alignItems: 'center', padding: '2%', margin: '2%'}}>
              <Card.Actions>
                {/* REGISTER BUTTON */}
                {(userHasPermission(userData?.roles) ||
                  sessionLeadID === uid) && (
                  <ConfirmButton
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
                {selectedSessionMentorsData.filter(
                  (mentor) => mentor.id === uid,
                ).length >= 1 ? (
                  <ConfirmButton
                    testID="leaveSessionButton"
                    title="Leave session"
                    onPress={() => {
                      leaveSession(id, uid, sessionLeadID);
                    }}></ConfirmButton>
                ) : (
                  <ConfirmButton
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
                  <Card.Content>
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
    </SafeAreaView>
  );
}
