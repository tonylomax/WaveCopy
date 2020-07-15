import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Moment from 'react-moment';
import {RegisterTabs} from 'components';
import {useSelector} from 'react-redux';
import {markAttendance, subscribeToSessionChanges} from 'utils';
import {USER_GROUP} from 'constants';
import {Checkbox, Paragraph, BottomNavigation} from 'react-native-paper';

export default function Register({navigation, route}) {
  //REDUX STATE
  const sessionData = useSelector(
    (state) => state.firestoreReducer.singleSession,
  );
  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionSubscribedAttendees,
  );
  const selectedSessionMentorsData = useSelector(
    (state) => state.firestoreReducer.selectedSessionSubscribedMentors,
  );
  //REDUX STATE

  //PROPS
  const {ID} = route.params;

  useEffect(() => {
    const unsubscribe = subscribeToSessionChanges(ID);
    return () => {
      console.log(`unsubscribing from session ${ID} changes`);
      unsubscribe();
    };
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
          //Retrieve the bool value that shows whether the person has attended the session
          const hasPersonAttended = sessionData?.Attendees?.filter((person) => {
            return person?.id === attendee?.id;
          })[0]?.Attended;
          return (
            <>
              <Paragraph>
                {attendee?.firstName} {attendee?.lastName}{' '}
              </Paragraph>
              <Checkbox.Android
                status={hasPersonAttended ? 'checked' : 'unchecked'}
                uncheckedColor="black"
                color="blue"
                onPress={() => {
                  markAttendance(
                    ID,
                    attendee.id,
                    sessionData,
                    USER_GROUP.ATTENDEES,
                  );
                }}
              />
            </>
          );
        })}
      </RegisterTabs>

      <RegisterTabs registerTitle="Mentors">
        {selectedSessionMentorsData?.map((mentor) => {
          const hasPersonAttended = sessionData?.Mentors?.filter((person) => {
            return person.id === mentor.id;
          })[0].Attended;
          return (
            <>
              <Paragraph>
                {mentor?.firstName} {mentor?.lastName}
              </Paragraph>
              <Checkbox.Android
                status={hasPersonAttended ? 'checked' : 'unchecked'}
                uncheckedColor="black"
                color="blue"
                onPress={() => {
                  markAttendance(
                    ID,
                    mentor.id,
                    sessionData,
                    USER_GROUP.MENTORS,
                  );
                }}
              />
            </>
          );
        })}
      </RegisterTabs>
    </View>
  );
}
