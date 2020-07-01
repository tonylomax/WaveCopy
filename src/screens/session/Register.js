import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Moment from 'react-moment';
import {RegisterTabs} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {subscribeToSession} from '../../redux/';
import {markAttendance} from 'utils';
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
      <Text>Attendee Register</Text>
      <Text>
        {sessionData?.Type} - {sessionData?.Beach}
      </Text>
      <Moment element={Text} format="DD.MM.YY">
        {sessionData?.DateTime}
      </Moment>
      {selectedSessionAttendeesData.map((attendee) => {
        const hasPersonAttended = sessionData.Attendees.filter((person) => {
          return person.id === attendee.id;
        })[0].Attended;
        return (
          <TouchableOpacity
            testID={`personToRegisterButton${attendee.id}`}
            onPress={() => {
              markAttendance(ID, attendee.id, sessionData);
            }}>
            <Text testID={`personToRegister${attendee.id}`}>
              {attendee.data.firstName} {attendee.data.lastName}{' '}
              {hasPersonAttended.toString()}
            </Text>
          </TouchableOpacity>
        );
      })}
      <RegisterTabs></RegisterTabs>
    </View>
  );
}
