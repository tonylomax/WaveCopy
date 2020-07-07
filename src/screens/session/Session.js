import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {AccordionMenu, ConfirmButton} from 'components';
import {Edit_Icon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import Moment from 'react-moment';
import {
  getAllSessionAttendees,
  subscribeToSession,
  getAllSessionMentors,
} from '../../redux/';
import {LoadingScreen} from 'components';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  const {ID, AttendeesIDandAttendance, Mentors} = route.params.item;
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
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const {roles} = useSelector((state) => state.authenticationReducer.roles);
  //LOCAL STATE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeGetAllSessionAttendees = dispatch(
      getAllSessionAttendees(AttendeesIDandAttendance),
    );
    const unsubscibeToSession = dispatch(subscribeToSession(ID));
    const unsubscribeGetAllSessionMentors = dispatch(
      getAllSessionMentors(Mentors),
    );
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
    console.log('roles', roles);
  }, [roles]);

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
          <Text>Coordinator: {sessionData?.CoordinatorID}</Text>
          <Text>{sessionData?.Description}</Text>
          {/* DATA TO BE ADDED INTO ACCORDION. */}
          <Text>{selectedSessionMentorsData[0]?.data?.firstName}</Text>
          <Text>{selectedSessionAttendeesData[0]?.data?.firstName}</Text>
          <Text>{selectedBeach?.data?.Name}</Text>
          {/* <AccordionMenu
            type="mentors"
            data={selectedSessionMentorsData}
            title={`Mentors ${sessionData?.Mentors?.length}/${sessionData?.MaxMentors}`}></AccordionMenu>
          <AccordionMenu
            type="attendees"
            data={selectedSessionAttendeesData}
            title={`Attendees  ${sessionData?.Attendees?.length}`}></AccordionMenu>
          <AccordionMenu
            data={beach}
            type="location"
            title="Location"></AccordionMenu> */}

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
        </>
      )}
    </View>
  );
}
