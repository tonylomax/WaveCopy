import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Moment from 'react-moment';
import {RegisterTabs} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {subscribeToSession} from '../../redux/';
import {markAttendance} from 'utils';
import {USER_GROUP} from '../../constants/userGroups';

export default function Register({navigation, route}) {
  const dispatch = useDispatch();

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

  //LOCAL STATE

  //PROPS
  const {ID} = route.params;

  useEffect(() => {
    const unsubscribeToSession = dispatch(subscribeToSession(ID));
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
      <RegisterTabs registerTitle="Attendees">
        {selectedSessionAttendeesData.map((attendee) => {
          const hasPersonAttended = sessionData.Attendees.filter((person) => {
            return person.id === attendee.id;
          })[0].Attended;
          return (
            <TouchableOpacity
              testID={`personToRegisterButton${attendee.id}`}
              onPress={() => {
                markAttendance(
                  ID,
                  attendee.id,
                  sessionData,
                  USER_GROUP.ATTENDEES,
                );
              }}>
              <Text testID={`personToRegister${attendee.id}`}>
                {attendee?.data?.firstName} {attendee?.data?.lastName}{' '}
                {hasPersonAttended.toString()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </RegisterTabs>

      <RegisterTabs registerTitle="Mentors">
        {selectedSessionMentorsData?.map((mentor) => {
          const hasPersonAttended = sessionData.Mentors.filter((person) => {
            return person.id === mentor.id;
          })[0].Attended;
          return (
            <TouchableOpacity
              testID={`personToRegisterButton${mentor.id}`}
              onPress={() => {
                markAttendance(ID, mentor.id, sessionData, USER_GROUP.MENTORS);
              }}>
              <Text testID={`personToRegister${mentor.id}`}>
                {mentor?.data?.firstName} {mentor?.data?.lastName}{' '}
                {hasPersonAttended.toString()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </RegisterTabs>
    </View>
  );
}
