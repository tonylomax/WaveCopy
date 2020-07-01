import React, {useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {AccordionMenu, ConfirmButton} from 'components';
import {Edit_Icon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import Moment from 'react-moment';
import {getAllSessionAttendees, subscribeToSession} from '../../redux/';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  const {ID, AttendeesIDandAttendance} = route.params.item;

  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionAttendees,
  );

  const sessionData = useSelector(
    (state) => state.firestoreReducer.singleSession,
  );

  useEffect(() => {
    dispatch(getAllSessionAttendees(AttendeesIDandAttendance));
    dispatch(subscribeToSession(ID));
  }, []);

  useEffect(() => {
    console.log('sessionData in Session.js', sessionData);
  }, [sessionData]);

  return (
    <View>
      <Image style={{height: '15%', width: '15%'}} source={Edit_Icon}></Image>
      <Moment element={Text} format="DD.MM.YY">
        {sessionData?.DateTime}
      </Moment>
      <Text>
        {sessionData?.Type}-{sessionData?.Beach}
      </Text>
      <Text>Coordinator: {sessionData?.CoordinatorID}</Text>
      <Text>{sessionData?.Description}</Text>
      <AccordionMenu
        title={`Mentors (0/${sessionData?.MaxMentors})`}></AccordionMenu>
      {/* <AccordionMenu
            type="attendees"
            title={`Attendees (0/${sessionData?.Attendees.length})`}></AccordionMenu> */}
      <AccordionMenu type="location" title="Location"></AccordionMenu>
      <ConfirmButton
        title="Register"
        testID="registerButton"
        onPress={() => {
          navigation.navigate('Register', {
            sessionData,
            selectedSessionAttendeesData,
            ID,
            // Type,
            // Beach,
            // DateTime,
            // selectedSessionAttendeesData,
            // AttendeesIDandAttendance,
          });
        }}>
        Register
      </ConfirmButton>
    </View>
  );
}
