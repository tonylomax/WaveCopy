import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Moment from 'react-moment';
import {RegisterTabs, SurferAvatar, VolunteerAvatar} from 'components';
import {useSelector} from 'react-redux';
import {markAttendance, subscribeToSessionChanges} from 'utils';
import {USER_GROUP} from 'constants';
import {
  Checkbox,
  Paragraph,
  BottomNavigation,
  Card,
  useTheme,
  Surface,
  Title,
  Divider,
  Subheading,
} from 'react-native-paper';

export default function Register({navigation, route}) {
  const {colors} = useTheme();

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
    <ScrollView>
      <Surface
        style={{
          padding: 80,
          width: '100%',
        }}>
        <Title style={{textAlign: 'center'}}>Attendance List</Title>

        <Divider
          style={{
            margin: 20,
          }}></Divider>
        <Subheading style={{textAlign: 'center'}}>
          {sessionData?.type === 'surf-club' ? 'Surf Club' : 'Surf Therapy'} -{' '}
          {sessionData?.beach}
        </Subheading>
        <Moment
          style={{textAlign: 'center'}}
          element={Paragraph}
          format="DD.MM.YY">
          {sessionData?.dateTime}
        </Moment>
      </Surface>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <Paragraph
          style={{
            marginLeft: 80,
          }}>
          Name
        </Paragraph>
        <Paragraph
          style={{
            marginLeft: 'auto',
          }}>
          Present
        </Paragraph>
      </View>
      <RegisterTabs registerTitle="Surfers">
        {selectedSessionAttendeesData.map((attendee, i) => {
          //Retrieve the bool value that shows whether the person has attended the session
          const hasPersonAttended = sessionData?.attendees?.filter((person) => {
            return person?.id === attendee?.id;
          })[0]?.attended;
          return (
            <Card key={i}>
              <Card.Content>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <SurferAvatar
                    label={`${attendee?.firstName.charAt(
                      0,
                    )}${attendee?.lastName.charAt(0)}`}
                  />

                  <Paragraph>
                    {attendee?.firstName} {attendee?.lastName}{' '}
                  </Paragraph>
                  <View
                    style={{
                      marginLeft: 'auto',
                    }}>
                    <Checkbox.Android
                      status={hasPersonAttended ? 'checked' : 'unchecked'}
                      uncheckedColor="black"
                      color={colors.primary}
                      onPress={() => {
                        markAttendance(
                          id,
                          attendee.id,
                          sessionData,
                          USER_GROUP.ATTENDEES,
                        );
                      }}
                    />
                  </View>
                </View>
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
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <VolunteerAvatar />
                  <Paragraph>
                    {mentor?.firstName} {mentor?.lastName}
                  </Paragraph>
                  <View style={{marginLeft: 'auto'}}>
                    <Checkbox.Android
                      status={hasPersonAttended ? 'checked' : 'unchecked'}
                      uncheckedColor="black"
                      color={colors.primary}
                      onPress={() => {
                        markAttendance(
                          id,
                          mentor.id,
                          sessionData,
                          USER_GROUP.MENTORS,
                        );
                      }}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          );
        })}
      </RegisterTabs>
    </ScrollView>
  );
}
