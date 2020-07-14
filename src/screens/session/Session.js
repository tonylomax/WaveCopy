import React, {useEffect, useState} from 'react';
import {View, Text, Image, Button, TouchableOpacity} from 'react-native';
import {
  AccordionMenu,
  ConfirmButton,
  ChoicePopup,
  LoadingScreen,
} from 'components';
import {Edit_Icon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import {CommonActions} from '@react-navigation/native';

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
  getSessionLeadName,
} from 'utils';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  const {ID, AttendeesIDandAttendance, Mentors, MaxMentors} = route.params.item;
  const {selectedBeach} = route.params;

  //REDUX STATE
  // Data on the session
  const sessionData = useSelector(
    (state) => state.firestoreReducer.singleSession,
  );
  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionAttendees,
  );
  const selectedSessionMentorsData = useSelector(
    (state) => state.firestoreReducer.selectedSessionMentors,
  );
  const sessionLeadID = useSelector(
    (state) => state.firestoreReducer?.singleSession?.SessionLead?.id,
  );

  // Current Auth User
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const {roles} = useSelector((state) => state.authenticationReducer.roles);

  //LOCAL STATE
  const [loading, setLoading] = useState(true);
  const [coordinator, setCoordinator] = useState();
  const [visible, setVisible] = useState(false);
  const [surfLead, setSurfLead] = useState();
  const IS_ADMIN =
    userData?.Roles?.includes('SurfLead') ||
    userData?.Roles?.includes('NationalAdmin') ||
    userData?.Roles?.includes('Coordinator');

  useEffect(() => {
    if (
      // If there are attendees, go get their full details from firestore
      AttendeesIDandAttendance !== undefined &&
      AttendeesIDandAttendance.length > 0
    ) {
      dispatch(getAllSessionAttendees(AttendeesIDandAttendance));
    }
    if (
      // If there are mentors, go get their full details from firestore
      Mentors !== undefined &&
      Mentors.length > 0
    ) {
      dispatch(getAllSessionMentors(Mentors));
    }
    const unsubscribeToSessionChanges = subscribeToSessionChanges(ID);
    return () => {
      console.log('unsubscribing');
      // Set selectedsession mentor & attendee data to empty arrays
      dispatch(clearSelectedSessionAttendees());
      dispatch(clearSelectedSessionMentors());
      unsubscribeToSessionChanges();
    };
  }, []);

  useEffect(() => {
    if (
      sessionData &&
      selectedSessionAttendeesData &&
      selectedSessionMentorsData
    ) {
      setLoading(false);
    }
    const surfLeadName = getSessionLeadName(
      sessionData?.SessionLead?.id,
      selectedSessionMentorsData,
    );
    setSurfLead(surfLeadName);
  }, [sessionData, selectedSessionAttendeesData, selectedSessionMentorsData]);

  useEffect(() => {
    (async () => {
      setCoordinator(await retrieveCoordinatorData(sessionData?.CoordinatorID));
    })();
  }, [sessionData]);

  return (
    <View>
      {loading ? (
        <LoadingScreen visible={true}></LoadingScreen>
      ) : (
        <View>
          <TouchableOpacity
            onPress={() => {
              const RouteDestination =
                route.name === 'HomeSession'
                  ? 'HomeEditSession'
                  : 'ProfileEditSession';
              navigation.push(RouteDestination, {
                previousSessionData: sessionData,
                previouslySelectedAttendees: selectedSessionAttendeesData,
                previouslySelectedMentors: selectedSessionMentorsData,
                previousSessionID: ID,
              });
            }}>
            <Image
              style={{height: '15%', width: '15%'}}
              source={Edit_Icon}></Image>
          </TouchableOpacity>
          <Text>Edit session</Text>
          {MaxMentors === selectedSessionMentorsData.length && (
            <Text> This session is full</Text>
          )}
          <Moment element={Text} format="DD.MM.YY">
            {sessionData?.DateTime}
          </Moment>
          {!sessionLeadID || sessionLeadID === '' ? (
            <Text>No session lead</Text>
          ) : sessionLeadID === UID ? (
            <Text>You are the session lead</Text>
          ) : (
            <Text>
              {surfLead?.firstName} {surfLead?.lastName} is the session lead
            </Text>
          )}
          <Text>
            {sessionData?.Type}-{sessionData?.Beach}
          </Text>
          <Text>
            Coordinator: {coordinator?.firstName} {coordinator?.lastName}
          </Text>

          <Text>{sessionData?.Description}</Text>
          <AccordionMenu
            selectedUsers={selectedSessionAttendeesData}
            numberOfMentors={MaxMentors}
            location={selectedBeach}
            mentors={selectedSessionMentorsData}
            sessionLead={sessionData?.SessionLead}
            sessionID={ID}
            roles={roles}
          />
          {IS_ADMIN && (
            <ConfirmButton
              title="Register"
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
          {IS_ADMIN && (
            <ConfirmButton
              title="Delete session"
              testID="delete-session-button"
              onPress={() => setVisible((visible) => !visible)}>
              Register
            </ConfirmButton>
          )}
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

          {selectedSessionMentorsData.some((mentor) => mentor.id === UID) ? (
            <ConfirmButton
              testID="leaveSessionButton"
              title="Leave session"
              onPress={() => {
                removeSelfFromSession(ID, UID, sessionData?.SessionLead?.id)
                  .then((result) => {
                    console.log('Session remove done');
                  })
                  .catch((err) => {
                    console.log('ERROR: ', err);
                  });
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
        </View>
      )}
    </View>
  );
}
