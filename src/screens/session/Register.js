import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import Moment from 'react-moment';
import {RegisterTabs} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {subscribeToSession} from '../../redux/';

export default function Register({navigation, route}) {
  const dispatch = useDispatch();
  const {ID} = route.params;
  const sessionData = useSelector(
    (state) => state.firestoreReducer.singleSession,
  );

  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionAttendees,
  );

  useEffect(() => {
    dispatch(subscribeToSession(ID));
  }, []);

  useEffect(() => {
    console.log('sessionData', sessionData);
    console.log('selectedSessionAttendeesData', selectedSessionAttendeesData);
  }, []);
  return (
    <View>
      <Text>Register</Text>
      <Text>
        {sessionData?.Type} - {sessionData?.Beach}
      </Text>
      <Moment element={Text} format="DD.MM.YY">
        {sessionData?.DateTime}
      </Moment>
      {selectedSessionAttendeesData.map((attendee) => {
        const attendanceArray = sessionData.Attendees.filter((person) => {
          return person.id === attendee.id;
        });
        return (
          <Text>
            {attendee.data.firstName} {attendee.data.lastName}{' '}
            {attendanceArray[0].Attended.toString()}
          </Text>
        );
      })}
      <RegisterTabs></RegisterTabs>
    </View>
  );
}
