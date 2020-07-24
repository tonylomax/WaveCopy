import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Moment from 'react-moment';
import {RegisterTabs} from 'components';
import {useSelector} from 'react-redux';
import {markAttendance, subscribeToSessionChanges} from 'utils';
import {USER_GROUP} from 'constants';
import {Checkbox, Paragraph, BottomNavigation, Card} from 'react-native-paper';

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
  const {id} = route.params;

  useEffect(() => {
    const unsubscribe = subscribeToSessionChanges(id);
    return () => {
      console.log(`unsubscribing from session ${id} changes`);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('selectedSessionMentorsData', selectedSessionMentorsData);
  }, [selectedSessionMentorsData]);

  return (
    <View>
      <Text>Attendee Register</Text>
      <Text>
        {sessionData?.type} - {sessionData?.beach}
      </Text>
      <Moment element={Text} format="DD.MM.YY">
        {sessionData?.dateTime}
      </Moment>

      <RegisterTabs registerTitle="Attendees">
        {selectedSessionAttendeesData.map((attendee, i) => {
          //Retrieve the bool value that shows whether the person has attended the session
          const hasPersonAttended = sessionData?.attendees?.filter((person) => {
            return person?.id === attendee?.id;
          })[0]?.attended;
          return (
            <Card key={i}>
              <Card.Content>
                <Paragraph>
                  {attendee?.firstName} {attendee?.lastName}{' '}
                </Paragraph>
                <Checkbox.Android
                  status={hasPersonAttended ? 'checked' : 'unchecked'}
                  uncheckedColor="black"
                  color="blue"
                  onPress={() => {
                    markAttendance(
                      id,
                      attendee.id,
                      sessionData,
                      USER_GROUP.ATTENDEES,
                    );
                  }}
                />
              </Card.Content>
            </Card>
          );
        })}
      </RegisterTabs>

      <RegisterTabs registerTitle="Mentors">
        {selectedSessionMentorsData?.map((mentor, i) => {
          const hasPersonAttended = sessionData?.mentors?.filter((person) => {
            return person.id === mentor.id;
          })[0].attended;
          return (
            <Card key={i}>
              <Card.Content>
                <Paragraph>
                  {mentor?.firstName} {mentor?.lastName}
                </Paragraph>
                <Checkbox.Android
                  status={hasPersonAttended ? 'checked' : 'unchecked'}
                  uncheckedColor="black"
                  color="blue"
                  onPress={() => {
                    markAttendance(
                      id,
                      mentor.id,
                      sessionData,
                      USER_GROUP.MENTORS,
                    );
                  }}
                />
              </Card.Content>
            </Card>
          );
        })}
      </RegisterTabs>
    </View>
  );
}
