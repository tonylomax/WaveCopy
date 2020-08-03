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
  List,
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
          paddingTop: 80,
          paddingBottom: 30,
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

      <List.AccordionGroup>
        <List.Accordion title="Surfers" id="1">
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Paragraph
              style={{
                marginLeft: 120,
              }}>
              Name
            </Paragraph>
            <Paragraph
              style={{
                marginLeft: 'auto',
                marginRight: 10,
              }}>
              Present
            </Paragraph>
          </View>
          {selectedSessionAttendeesData.map((attendee, i) => {
            //Retrieve the bool value that shows whether the person has attended the session
            const hasPersonAttended = sessionData?.attendees?.filter(
              (person) => {
                return person?.id === attendee?.id;
              },
            )[0]?.attended;
            return (
              <Card
                key={i}
                style={{
                  borderTopWidth: i === 0 ? 1 : 0,
                  borderBottomWidth: 1,
                  borderColor: 'black',
                  borderStyle: 'solid',
                }}>
                <Card.Content
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

                  <Paragraph style={{maxWidth: '70%'}}>
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
                </Card.Content>
              </Card>
            );
          })}
        </List.Accordion>
        <List.Accordion title="Mentors" id="2">
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Paragraph
              style={{
                marginLeft: 120,
              }}>
              Name
            </Paragraph>
            <Paragraph
              style={{
                marginLeft: 'auto',
                marginRight: 10,
              }}>
              Present
            </Paragraph>
          </View>
          {selectedSessionMentorsData?.map((mentor, i) => {
            console.log({mentor});
            const hasPersonAttended = sessionData?.mentors?.filter((person) => {
              return person.id === mentor.id;
            })[0].attended;

            return (
              <Card
                style={{
                  borderTopWidth: i === 0 ? 1 : 0,
                  borderBottomWidth: 1,
                  borderColor: 'black',
                  borderStyle: 'solid',
                }}
                key={i}>
                <Card.Content
                  style={{
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <VolunteerAvatar
                    label={`${mentor?.firstName.charAt(
                      0,
                    )}${mentor?.lastName.charAt(0)}`}
                  />
                  <Paragraph style={{maxWidth: '50%'}}>
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
                </Card.Content>
              </Card>
            );
          })}
        </List.Accordion>
      </List.AccordionGroup>
    </ScrollView>
  );
}
