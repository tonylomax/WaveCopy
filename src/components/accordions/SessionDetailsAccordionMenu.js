import React, {useEffect} from 'react';
import {
  Text,
  Alert,
  View,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {List, Divider, Card, Paragraph} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';

import {AddButton, CloseButton} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {
  assignSessionLead,
  unassignSessionLead,
  removeMentorFromSession,
} from 'utils';
import {ScrollView} from 'react-native-gesture-handler';

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

  useEffect(() => {
    console.log('location', location.GivenCoordinates);
  }, [location]);

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
          <ScrollView>
            <MapView
              initialRegion={{
                latitude: location?.ResearchedCoordinates?.latitude,
                longitude: location?.ResearchedCoordinates?.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              style={{
                maxWidth: '99%',
                maxHeight: '75%',
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                ...StyleSheet.absoluteFill,
              }}>
              <Marker
                coordinate={{
                  latitude: location?.ResearchedCoordinates?.latitude,
                  longitude: location?.ResearchedCoordinates?.longitude,
                }}
                title={'Beach'}
                description={'Cool beach'}
              />
            </MapView>

            <Card.Content style={{paddingTop: 400, paddingBottom: 5}}>
              <Paragraph>{location?.Address?.FirstLine}</Paragraph>
              <Paragraph>{location?.Address?.SecondLine}</Paragraph>
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
          </ScrollView>
        </Card>
      </List.Accordion>
    </List.AccordionGroup>
  );
}
