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
import {Card, Title, Divider, Paragraph} from 'react-native-paper';
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
  //LOCAL STATE

  useEffect(() => {
    setCoverImage(getCoverImage(selectedBeach));
  }, []);

  useEffect(() => {
    // console.log('sessionData', sessionData);
    console.log('sessionData', sessionData?.mentors);
    // console.log('MENTORS', Mentors);
    console.log('selectedSessionMentorsData', selectedSessionMentorsData);
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

  // useEffect(() => {

  // }, []);

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
    const SURFLEAD = selectedSessionMentorsData?.filter(
      (mentor) => mentor.id === sessionLeadID,
    );

    setSurfLead(SURFLEAD[0]);
  }, [selectedSessionMentorsData, sessionData]);

  useEffect(() => {
    console.log({sessionData});
    (async () => {
      setCoordinator(await retrieveCoordinatorData(sessionData?.CoordinatorID));
    })();
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
            <View
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  navigation.push('SessionDetails', {
                    previousSessionData: sessionData,
                    previouslySelectedAttendees: selectedSessionAttendeesData,
                    previouslySelectedMentors: selectedSessionMentorsData,
                    previousSessionID: id,
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
            <Title style={{alignSelf: 'center'}}>
              Coordinator{'\n'}
              <Paragraph>
                {' '}
                {coordinator?.firstName} {coordinator?.lastName}
              </Paragraph>
            </Title>

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
                {/* DElETE SESSION */}
                {userHasPermission(userData?.roles) && (
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
              </Card.Actions>
            </Card>

            <ChoicePopup
              testID="choicePopup"
              visible={visible}
              setVisible={setVisible}
              yesAction={() => {
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
                  .catch((err) => console.log('error deleting session', err));
              }}></ChoicePopup>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
