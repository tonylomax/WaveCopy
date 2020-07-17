import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  SessionDetailsAccordionMenu,
  ConfirmButton,
  ChoicePopup,
  LoadingScreen,
} from 'components';
import {Edit_Icon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import {serializeError} from 'serialize-error';
import Moment from 'react-moment';
import {
  getAllSessionAttendees,
  getAllSessionMentors,
  clearSelectedSessionMentors,
  clearSelectedSessionAttendees,
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
import {Card, Title, Divider, Paragraph} from 'react-native-paper';
import {COLLECTIONS} from 'constants';
import {startCase} from 'lodash';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  // If coming from home, there is an item field,
  const {ID, AttendeesIDandAttendance, Mentors, MaxMentors} = route?.params
    ?.item
    ? route?.params?.item
    : route?.params?.session;

  const {selectedBeach} = route.params;

  useEffect(() => {
    console.log('selectedBeach in session', selectedBeach);
  }, [selectedBeach]);

  //REDUX STATE
  // Data on the session
  const sessionData = useSelector(
    (state) => state.firestoreReducer.singleSession,
  );
  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionSubscribedAttendees,
  );

  const selectedSessionMentorsData = useSelector(
    (state) => state.firestoreReducer.selectedSessionSubscribedMentors,
  );

  const sessionLeadID = useSelector(
    (state) => state.firestoreReducer?.singleSession?.SessionLead?.id,
  );

  // Current Auth User
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const {roles} = useSelector((state) => state.authenticationReducer.roles);

  //LOCAL STATE
  const [coordinator, setCoordinator] = useState();
  const [visible, setVisible] = useState(false);
  const [surfLead, setSurfLead] = useState();
  const IS_ADMIN =
    userData?.Roles?.includes('SurfLead') ||
    userData?.Roles?.includes('NationalAdmin') ||
    userData?.Roles?.includes('Coordinator');
  const [CoverImage, setCoverImage] = useState();
  //LOCAL STATE

  useEffect(() => {
    console.log('sessionData', sessionData);
    console.log('MENTORS', Mentors);

    // Set up subscription for all the data relating to the mentors in a session
    const mentorsUnsubscribers = updateCurrentSessionAttendees(
      sessionData?.Mentors,
      COLLECTIONS.USERS,
    );
    // Set up subscription for all the data relating to the attendees in a session
    const serviceUsersUnsubscribers = updateCurrentSessionAttendees(
      sessionData?.Attendees,
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
      dispatch(clearSelectedSessionMentors());
      dispatch(clearSelectedSessionAttendees());
    };
  }, [sessionData]);

  useEffect(() => {
    console.log('selected beach IN SESSIONS', selectedBeach);
    setCoverImage(getCoverImage(selectedBeach));
  }, []);

  useEffect(() => {
    // Set up subscription for all the session data
    const unsubscribe = subscribeToSessionChanges(ID);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const SURFLEAD = selectedSessionMentorsData?.filter(
      (mentor) => mentor.id === sessionLeadID,
    );
    console.log('SURFLEAD', SURFLEAD);
    setSurfLead(SURFLEAD[0]);
  }, [selectedSessionMentorsData, sessionData]);

  useEffect(() => {
    (async () => {
      setCoordinator(await retrieveCoordinatorData(sessionData?.CoordinatorID));
    })();
  }, [sessionData]);

  const leaveSession = (ID, UID, sessionLeadID) => {
    removeSelfFromSession(ID, UID, sessionLeadID)
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
            <View
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  const nextScreen =
                    route.name === 'HomeSession'
                      ? 'HomeEditSession'
                      : 'ProfileEditSession';
                  navigation.push(nextScreen, {
                    previousSessionData: sessionData,
                    previouslySelectedAttendees: selectedSessionAttendeesData,
                    previouslySelectedMentors: selectedSessionMentorsData,
                    previousSessionID: ID,
                  });
                }}>
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    overflow: 'visible',
                    tintColor: 'white',
                    marginRight: '1%',
                    marginTop: '10%',
                  }}
                  source={Edit_Icon}></Image>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <View>
            <Paragraph style={{alignSelf: 'center'}}>
              <Moment element={Text} format="LLLL">
                {sessionData?.DateTime}
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
              {startCase(sessionData?.Type?.replace(/-/gi, ' '))}-
              {sessionData?.Beach?.replace(/-/gi, ' ')}
            </Paragraph>

            {/* Cover coordinator */}
            <Title style={{alignSelf: 'center'}}>
              Coordinator{'\n'}
              <Paragraph>
                {' '}
                {coordinator?.firstName} {coordinator?.lastName}
              </Paragraph>
            </Title>

            {/* Session description */}
            <Paragraph>{sessionData?.Description}</Paragraph>
            {/* Session Accordion menu for attendees */}

            {/* Show if session is full */}
            {MaxMentors === selectedSessionMentorsData.length && (
              <Text>This session is full</Text>
            )}
            {/* Session date/time */}

            {/* Session Lead */}
            {!sessionLeadID || sessionLeadID === '' ? (
              <Text>No session lead</Text>
            ) : sessionLeadID === UID ? (
              <Text>You are the session lead</Text>
            ) : (
              <Text>
                {surfLead?.firstName} {surfLead?.lastName} is the session lead
              </Text>
            )}

            {selectedSessionAttendeesData &&
              selectedBeach &&
              MaxMentors > 0 &&
              selectedSessionMentorsData && (
                <SessionDetailsAccordionMenu
                  selectedUsers={selectedSessionAttendeesData}
                  numberOfMentors={MaxMentors}
                  location={selectedBeach}
                  mentors={selectedSessionMentorsData}
                  navigation={navigation}
                  route={route}
                  sessionLead={sessionData?.SessionLead}
                  sessionID={ID}
                  roles={roles}
                />
              )}

            <Card style={{alignItems: 'center', padding: '2%', margin: '2%'}}>
              <Card.Actions>
                {/* REGISTER BUTTON */}
                {(userHasPermission(userData?.Roles) ||
                  sessionLeadID === UID) && (
                  <ConfirmButton
                    title="Attendance"
                    testID="registerButton"
                    onPress={() => {
                      navigation.navigate('Register', {
                        ID,
                      });
                    }}>
                    Register
                  </ConfirmButton>
                )}
                {/* DElETE SESSION */}
                {userHasPermission(userData?.Roles) && (
                  <ConfirmButton
                    title="Delete session"
                    testID="delete-session-button"
                    onPress={() => setVisible((visible) => !visible)}>
                    Register
                  </ConfirmButton>
                )}
                {/* Popup to confirm delete session */}

                {/* LEAVE/SIGNUP */}
                {/* Only show if signup button if user is in the session, otherwise show signup button */}
                {selectedSessionMentorsData.filter(
                  (mentor) => mentor.id === UID,
                ).length >= 1 ? (
                  <ConfirmButton
                    testID="leaveSessionButton"
                    title="Leave session"
                    onPress={() => {
                      leaveSession(ID, UID, sessionLeadID);
                    }}></ConfirmButton>
                ) : (
                  <ConfirmButton
                    testID="signupButton"
                    title="Sign Up"
                    disabled={MaxMentors === selectedSessionMentorsData.length}
                    onPress={() => {
                      signupForSession(ID, UID)
                        .then((result) => {
                          console.log('Session signup done ');
                        })
                        .catch((err) => {
                          console.log('ERROR: ', err);
                        });
                    }}></ConfirmButton>
                )}
              </Card.Actions>
            </Card>

            <ChoicePopup
              testID="choicePopup"
              visible={visible}
              setVisible={setVisible}
              yesAction={() => {
                console.log('deleting session');
                deleteSession(ID, UID)
                  .then((res) => {
                    console.log(res);
                    const RouteDestination =
                      route.name === 'HomeSession' ? 'Home' : 'Profile';
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: RouteDestination}],
                      }),
                    );
                  })
                  .catch((err) => console.log(err));
              }}></ChoicePopup>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
