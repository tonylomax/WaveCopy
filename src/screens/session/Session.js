import React, {useEffect, useState} from 'react';
import {View, Text, Image, Button} from 'react-native';
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
  clearSelectedSessionMentors,
  clearSelectedSessionAttendees,
} from '../../redux/';

import {
  subscribeToSessionChanges,
  signupForSession,
  retrieveCoordinatorData,
  removeSelfFromSession,
  deleteSession,
  userHasRoles,
  updateCurrentSessionAttendees,
} from 'utils';

import {COLLECTIONS} from 'constants';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  const {ID, AttendeesIDandAttendance, Mentors, MaxMentors} = route.params.item;
  const {selectedBeach} = route.params;

  //REDUX STATE
  const sessionData = useSelector(
    (state) => state.firestoreReducer.singleSession,
  );

  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionSubscribedAttendees,
  );

  const sessionLeadID = useSelector(
    (state) => state.firestoreReducer?.singleSession?.SessionLead?.id,
  );
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const {roles} = useSelector((state) => state.authenticationReducer.roles);

  const selectedSessionMentorsData = useSelector((state) => {
    console.log(
      'state in session ',
      state.firestoreReducer.selectedSessionSubscribedMentors,
    );
    return state.firestoreReducer.selectedSessionSubscribedMentors;
  });

  //LOCAL STATE
  const [coordinator, setCoordinator] = useState();
  const [visible, setVisible] = useState(false);
  const [surfLead, setSurfLead] = useState();

  useEffect(() => {
    console.log('sessionData', sessionData);
    console.log('MENTORS', Mentors);

    const mentorsUnsubscribers = updateCurrentSessionAttendees(
      sessionData?.Mentors,
      COLLECTIONS.USERS,
    );

    const serviceUsersUnsubscribers = updateCurrentSessionAttendees(
      sessionData?.Attendees,
      COLLECTIONS.TEST_SERVICE_USERS,
    );

    return () => {
      console.log('unsubscribing');
      mentorsUnsubscribers?.forEach((unsub) => {
        console.log('unsub called');
        unsub();
      });
      serviceUsersUnsubscribers?.forEach((unsub) => {
        console.log('unsub called');
        unsub();
      });
      dispatch(clearSelectedSessionMentors());
      dispatch(clearSelectedSessionAttendees());
    };
  }, [sessionData]);

  useEffect(() => {
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

  return (
    <View>
      <Image style={{height: '15%', width: '15%'}} source={Edit_Icon}></Image>
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
      {selectedSessionAttendeesData &&
        selectedBeach &&
        MaxMentors > 0 &&
        selectedSessionMentorsData && (
          <AccordionMenu
            selectedUsers={selectedSessionAttendeesData}
            numberOfMentors={MaxMentors}
            location={selectedBeach}
            mentors={selectedSessionMentorsData}
            sessionLead={sessionData?.SessionLead}
            sessionID={ID}
            roles={roles}
          />
        )}
      {(userHasRoles(userData?.Roles) || sessionLeadID === UID) && (
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
      {roles?.some(
        () =>
          userData?.Roles?.includes('NationalAdmin') ||
          userData?.Roles?.includes('RegionalManager') ||
          userData?.Roles?.includes('Coordinator'),
      ) && (
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

              // If this session was reached from profile, go back to home,
              // Otherwise go back to profile
              if (route.name === 'HomeSession') {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                );
              } else {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Profile'}],
                  }),
                );
              }
            })
            .catch((err) => console.log(err));
        }}></ChoicePopup>

      {selectedSessionMentorsData.filter((mentor) => mentor.id === UID)
        .length >= 1 ? (
        <ConfirmButton
          testID="leaveSessionButton"
          title="Leave session"
          onPress={() => {
            removeSelfFromSession(ID, UID, sessionLeadID)
              .then((result) => {
                console.log('Session remove done');
                navigation.goBack();
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
      <ConfirmButton
        title="Determine roles"
        onPress={() => {
          console.log('userData?.Roles)', userData?.Roles);
          console.log(userHasRoles(userData?.Roles));
        }}></ConfirmButton>
    </View>
  );
}
