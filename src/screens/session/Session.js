import React, {useEffect, useState} from 'react';
import {View, Text, Image, Button} from 'react-native';
import {AccordionMenu, ConfirmButton, LoadingScreen} from 'components';
import {Edit_Icon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import Moment from 'react-moment';
import {
  getAllSessionAttendees,
  updateCurrentSession,
  getAllSessionMentors,
  clearSelectedSessionMentors,
  clearSelectedSessionAttendees,
} from '../../redux/';

import {
  subscribeToSessionChanges,
  signupForSession,
  retrieveCoordinatorData,
  removeSelfFromSession,
  assignSessionLead,
} from 'utils';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  const {ID, AttendeesIDandAttendance, Mentors, MaxMentors} = route.params.item;
  const {selectedBeach} = route.params;

  //REDUX STATE
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
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const {roles} = useSelector((state) => state.authenticationReducer.roles);

  //LOCAL STATE
  const [loading, setLoading] = useState(true);
  const [coordinator, setCoordinator] = useState();
  const [surfLead, setSurfLead] = useState();

  useEffect(() => {
    if (
      AttendeesIDandAttendance !== undefined &&
      AttendeesIDandAttendance.length > 0
    ) {
      console.log({AttendeesIDandAttendance});
      dispatch(getAllSessionAttendees(AttendeesIDandAttendance));
    }
    dispatch(getAllSessionMentors(Mentors));
    console.log('max mentors is ', MaxMentors);
    const unsubscribe = subscribeToSessionChanges(ID);
    return () => {
      console.log('unsubscribing');
      dispatch(clearSelectedSessionMentors());
      dispatch(clearSelectedSessionAttendees());
      unsubscribe();
    };
  }, []);

  const getSessionLeadName = (surfLeadID) => {
    console.log('selectedSessionMentorsData', selectedSessionMentorsData);
    const SURFLEAD = selectedSessionMentorsData?.filter(
      (mentor) => mentor.id === surfLeadID,
    );
    console.log('SURFLEAD', SURFLEAD);
    setSurfLead(SURFLEAD[0]);
  };

  useEffect(() => {
    getSessionLeadName(sessionData?.SessionLead?.id);
  }, [selectedSessionMentorsData, sessionData]);

  useEffect(() => {
    if (
      sessionData &&
      selectedSessionAttendeesData &&
      selectedSessionMentorsData
    ) {
      setLoading(false);
    }
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
          <Image
            style={{height: '15%', width: '15%'}}
            source={Edit_Icon}></Image>
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
          {roles?.some(
            () =>
              userData?.Roles?.includes('SurfLead') ||
              userData?.Roles?.includes('NationalAdmin') ||
              userData?.Roles?.includes('Coordinator'),
          ) && (
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

          {selectedSessionMentorsData.filter((mentor) => mentor.id === UID)
            .length >= 1 ? (
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
