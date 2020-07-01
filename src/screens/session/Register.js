import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import Moment from 'react-moment';
import {RegisterTabs} from 'components';

export default function Register({navigation, route}) {
  const {
    Type,
    Beach,
    DateTime,
    selectedSessionAttendeesData,
    AttendeesIDandAttendance,
  } = route.params;

  useEffect(() => {
    console.log('selectedSessionAttendeesData', selectedSessionAttendeesData);
    console.log('Attendees', AttendeesIDandAttendance);
  }, []);
  return (
    <View>
      <Text>Register</Text>
      <Text>
        {Type} - {Beach}
      </Text>
      <Moment element={Text} format="DD.MM.YY">
        {DateTime}
      </Moment>
      {selectedSessionAttendeesData.map((attendee) => {
        const attendanceArray = AttendeesIDandAttendance.filter((person) => {
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
