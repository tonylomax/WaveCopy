import React, {useEffect, useState} from 'react';
import {View, Text, Image, Button} from 'react-native';
import {AccordionMenu, ConfirmButton} from 'components';
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
import {LoadingScreen} from 'components';
import {
  subscribeToSessionChanges,
  signupForSession,
  retrieveCoordinatorData,
  removeSelfFromSession,
  assignSessionLead,
  unassignSessionLead,
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
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);

  const userData = useSelector((state) => state.firestoreReducer.userData);
  const {roles} = useSelector((state) => state.authenticationReducer.roles);
  //LOCAL STATE
  const [loading, setLoading] = useState(true);
  const [coordinator, setCoordinator] = useState();
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
        <>
          <Image
            style={{height: '15%', width: '15%'}}
            source={Edit_Icon}></Image>
          <Moment element={Text} format="DD.MM.YY">
            {sessionData?.DateTime}
          </Moment>
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
          <ConfirmButton
            testID="signupButton"
            title="Sign Up"
            onPress={() => {
              signupForSession(ID, UID)
                .then((result) => {
                  console.log('Session signup done ');
                })
                .catch((err) => {
                  console.log('ERROR: ', err);
                });
            }}></ConfirmButton>
          <ConfirmButton
            testID="leaveSessionButton"
            title="Leave session"
            onPress={() => {
              removeSelfFromSession(ID, UID)
                .then((result) => {
                  console.log('Session remove done');
                })
                .catch((err) => {
                  console.log('ERROR: ', err);
                });
            }}></ConfirmButton>
        </>
      )}
    </View>
  );
}
