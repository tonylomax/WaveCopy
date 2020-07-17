import React, {useEffect} from 'react';
import {Text, Alert, View} from 'react-native';
import {List, Divider, Card, Paragraph} from 'react-native-paper';

import {AddButton, CloseButton} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {
  assignSessionLead,
  unassignSessionLead,
  removeMentorFromSession,
} from 'utils';

export default function SessionDetailsAccordionMenu({
  navigation,
  route,
  testID,
  location,
  selectedUsers,
  numberOfMentors,
  mentors,
  sessionLead,
  sessionID,
  roles,
}) {
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);

  return (
    <List.AccordionGroup>
      <List.Accordion
        testID="mentors-accordian"
        title={`Mentors (${mentors?.length || 0}/${numberOfMentors})`}
        id="1">
        {mentors?.length > 0 &&
          mentors?.map((mentor, i) => (
            <View>
              <List.Item
                testID={`session-accordion-mentor${mentor.id}`}
                onPress={() => {
                  console.log('mentor in accord', mentor);
                  console.log(
                    'route when going to volunteer profile screen ',
                    route,
                    route.name,
                  );
                  const routeDestination =
                    route.name === 'HomeSession'
                      ? 'Home Volunteer Profile'
                      : 'Profile Volunteer Profile';
                  navigation.navigate(routeDestination, {mentor});
                }}
                key={`mentor-${i + 1}`}
                title={`${i + 1}. ${mentor?.firstName} ${mentor?.lastName}`}
              />
              {roles?.some(
                () =>
                  userData?.Roles?.includes('SurfLead') ||
                  userData?.Roles?.includes('NationalAdmin') ||
                  userData?.Roles?.includes('Coordinator') ||
                  sessionLead?.id === UID,
              ) && (
                <View>
                  <CloseButton
                    testID={`removeAsMentorButton${mentor.id}`}
                    onPress={() => {
                      removeMentorFromSession(
                        sessionID,
                        mentor.id,
                        UID,
                        sessionLead?.id,
                      )
                        .then((result) => {
                          console.log('Mentor remove done', result);
                        })
                        .catch((err) => {
                          console.log('ERROR OUTSIDE TRANSACTION ', err);
                          Alert.alert(err);
                        });
                    }}
                    title="Remove as Mentor"></CloseButton>
                  {sessionLead?.id === mentor.id ? (
                    <CloseButton
                      title="Remove as Lead"
                      onPress={() => {
                        unassignSessionLead(sessionID, mentor.id, UID).catch(
                          (err) => {
                            console.log('ERROR OUTSIDE TRANSACTION ', err);
                            Alert.alert(err);
                          },
                        );
                      }}></CloseButton>
                  ) : (
                    <AddButton
                      onPress={() => {
                        assignSessionLead(sessionID, mentor.id, UID).catch(
                          (err) => {
                            console.log('ERROR OUTSIDE TRANSACTION ', err);
                            Alert.alert(err);
                          },
                        );
                      }}
                      title="Add as Lead"></AddButton>
                  )}
                </View>
              )}
              <Divider />
            </View>
          ))}
      </List.Accordion>
      <List.Accordion
        title={`Attendees (${selectedUsers?.length})`}
        id="2"
        testID="attendees-accordian">
        {selectedUsers.length > 0 &&
          selectedUsers?.map((serviceUser, i) => (
            <View>
              <List.Item
                onPress={() => {
                  if (
                    roles?.some(
                      () =>
                        userData?.Roles?.includes('SurfLead') ||
                        userData?.Roles?.includes('NationalAdmin') ||
                        userData?.Roles?.includes('Coordinator') ||
                        sessionLead?.id === UID,
                    )
                  ) {
                    console.log('route  in profile on click', route);
                    console.log('route name in profile on click', route.name);
                    const routeDestination =
                      route.name === 'HomeSession'
                        ? 'Home ServiceUser Profile'
                        : 'Profile ServiceUser Profile';
                    navigation.navigate(routeDestination, {
                      serviceUser,
                      roles,
                    });
                  } else {
                    Alert.alert("You don't have permission to do this");
                  }
                }}
                testId="attendees-accordian"
                key={`attendee-${i + 1}`}
                title={`${i + 1}. ${serviceUser?.firstName} ${
                  serviceUser?.lastName
                }`}
              />
              <Divider />
            </View>
          ))}
      </List.Accordion>
      <List.Accordion title="Location" id="3" testID="location-accordian">
        <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
          <Card.Cover
            source={{
              uri:
                'https://i2-prod.cornwalllive.com/incoming/article3890349.ece/ALTERNATES/s1200b/0_coro-mapJPG.jpg',
            }}
          />
          <Card.Content>
            <Paragraph>{location?.Address?.Firstline}</Paragraph>
            <Paragraph>{location?.Address?.Secondline}</Paragraph>
            <Paragraph>{location?.Address?.PostCode}</Paragraph>
          </Card.Content>
          <Card.Title title="Parking" />
          <Card.Content>
            <Paragraph>{location?.Parking}</Paragraph>
          </Card.Content>
          <Card.Title title="Toilets" />
          <Card.Content>
            <Paragraph>{location?.Toilets}</Paragraph>
          </Card.Content>
        </Card>
      </List.Accordion>
    </List.AccordionGroup>
  );
}
