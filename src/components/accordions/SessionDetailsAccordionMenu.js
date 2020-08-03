import React, {useEffect, useState} from 'react';
import {
  Text,
  Alert,
  View,
  Linking,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Button,
} from 'react-native';
import {List, Divider, Card, Paragraph} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';

import {ConfirmButton, CloseButton, VolunteerAvatar} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {
  assignSessionLead,
  unassignSessionLead,
  removeMentorFromSession,
} from 'utils';
import {ScrollView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-swipeable';

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
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  const [mentorsExpanded, setMentorsExpanded] = useState(false);
  const [attendeesExpanded, setAttendeesExpanded] = useState(false);
  useEffect(() => {
    console.log('mentors', mentors);
  }, [mentors]);

  return (
    // <List.AccordionGroup>
    <List.Section
    //  style={{margin: 0, width: '100%'}}
    >
      <List.Accordion
        expanded={mentors.length > 0 ? mentorsExpanded : false}
        theme={{
          colors: {
            text: mentors.length > 0 ? 'black' : 'grey',
          },
        }}
        onPress={() => {
          setMentorsExpanded((mentorsExpanded) => !mentorsExpanded);
        }}
        title={`Mentors (${mentors?.length || 0}/${numberOfMentors})`}
        testID="mentors-accordian"
        id="1">
        {mentors?.length > 0 &&
          mentors?.map((mentor, i) => {
            const rightButtons = [
              <ConfirmButton
                style={{marginRight: 50}}
                testID={`removeAsMentorButton${mentor.id}`}
                onPress={() => {
                  removeMentorFromSession(
                    sessionID,
                    mentor.id,
                    uid,
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
                title="Remove as Mentor"></ConfirmButton>,
              sessionLead?.id === mentor.id ? (
                <CloseButton
                  title="Remove as Lead"
                  onPress={() => {
                    unassignSessionLead(sessionID, mentor.id, uid).catch(
                      (err) => {
                        console.log('ERROR OUTSIDE TRANSACTION ', err);
                        Alert.alert(err);
                      },
                    );
                  }}></CloseButton>
              ) : (
                <ConfirmButton
                  onPress={() => {
                    assignSessionLead(sessionID, mentor.id, uid).catch(
                      (err) => {
                        console.log('ERROR OUTSIDE TRANSACTION ', err);
                        Alert.alert(err);
                      },
                    );
                  }}
                  title="Add as Lead"></ConfirmButton>
              ),
            ];
            return (
              // <Swipeable
              //   // style={{flex: 1, marginBottom: 4, position: 'relative'}}
              //   rightButtons={rightButtons}
              //   rightContainerStyle={{margin: 0, padding: 0, color: 'red'}}
              //   rightButtonContainerStyle={{
              //     alignItems: 'flex-start',
              //     justifyContent: 'space-between',
              //     flexWrap: 'wrap',
              //     alignContent: 'space-between',
              //     // paddingLeft: '-20%',
              //     marginLeft: '-20%',
              //     // width: 600,
              //     alignItems: 'stretch',
              //     // margin: '2%',
              //     // margin: 0,
              //     padding: 0,
              //   }}>
              <View>
                {/* <List.Item
                  testID={`session-accordion-mentor${mentor.id}`}
                  key={`mentor-${i + 1}`}></List.Item> */}
                <Card
                  onPress={() => {
                    if (route.name !== 'ConfirmSession') {
                      const routeDestination =
                        route.name === 'HomeSession'
                          ? 'Home Volunteer Profile'
                          : 'Profile Volunteer Profile';
                      navigation.navigate(routeDestination, {mentor});
                    }
                  }}>
                  <Card.Title
                    title={`${mentor?.firstName} ${mentor?.lastName}`}></Card.Title>

                  <Card.Content>
                    <VolunteerAvatar
                      label={}
                      isProfilePicture={true}></VolunteerAvatar>
                  </Card.Content>
                </Card>
              </View>

              // {roles?.some(
              //     () =>
              //       userData?.roles?.includes('SurfLead') ||
              //       userData?.roles?.includes('NationalAdmin') ||
              //       userData?.roles?.includes('Coordinator') ||
              //       sessionLead?.id === uid,
              //   ) && (
              //     <View>
              //       <CloseButton
              //         testID={`removeAsMentorButton${mentor.id}`}
              //         onPress={() => {
              //           removeMentorFromSession(
              //             sessionID,
              //             mentor.id,
              //             uid,
              //             sessionLead?.id,
              //           )
              //             .then((result) => {
              //               console.log('Mentor remove done', result);
              //             })
              //             .catch((err) => {
              //               console.log('ERROR OUTSIDE TRANSACTION ', err);
              //               Alert.alert(err);
              //             });
              //         }}
              //         title="Remove as Mentor"></CloseButton>
              //       {sessionLead?.id === mentor.id ? (
              //         <CloseButton
              //           title="Remove as Lead"
              //           onPress={() => {
              //             unassignSessionLead(
              //               sessionID,
              //               mentor.id,
              //               uid,
              //             ).catch((err) => {
              //               console.log('ERROR OUTSIDE TRANSACTION ', err);
              //               Alert.alert(err);
              //             });
              //           }}></CloseButton>
              //       ) : (
              //         <ConfirmButton
              //           onPress={() => {
              //             assignSessionLead(sessionID, mentor.id, uid).catch(
              //               (err) => {
              //                 console.log('ERROR OUTSIDE TRANSACTION ', err);
              //                 Alert.alert(err);
              //               },
              //             );
              //           }}
              //           title="Add as Lead"></ConfirmButton>
              //       )}
              //     </View>
              //   )}

              // </Swipeable>
            );
          })}
      </List.Accordion>
      <List.Accordion
        expanded={selectedUsers.length > 0 ? attendeesExpanded : false}
        theme={{
          colors: {
            text: selectedUsers.length > 0 ? 'black' : 'grey',
          },
        }}
        onPress={() => {
          setAttendeesExpanded((attendeesExpanded) => !attendeesExpanded);
        }}
        title={
          selectedUsers.length > 0
            ? `Surfers (${selectedUsers?.length})`
            : 'No Attendees'
        }
        id="2"
        testID="attendees-accordian">
        {selectedUsers.length > 0 &&
          selectedUsers?.map((serviceUser, i) => (
            <View>
              <List.Item
                onPress={() => {
                  if (route.name === 'ConfirmSession') {
                    console.log('do nothing');
                  } else if (
                    roles?.some(
                      () =>
                        userData?.roles?.includes('SurfLead') ||
                        userData?.roles?.includes('NationalAdmin') ||
                        userData?.roles?.includes('Coordinator') ||
                        sessionLead?.id === uid,
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
                latitude: location?.researchedCoordinates?.latitude,
                longitude: location?.researchedCoordinates?.longitude,
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
                  latitude: location?.researchedCoordinates?.latitude,
                  longitude: location?.researchedCoordinates?.longitude,
                }}
                title={'Beach'}
                description={'Cool beach'}
              />
            </MapView>

            <Card.Content style={{paddingTop: 400, paddingBottom: 5}}>
              <Paragraph>{location?.address?.firstLine}</Paragraph>
              <Paragraph>{location?.address?.secondLine}</Paragraph>
              <Paragraph>{location?.address?.postCode}</Paragraph>
            </Card.Content>
            <Card.Title title="Parking" />
            <Card.Content>
              <Paragraph>{location?.parking}</Paragraph>
            </Card.Content>
            <Card.Title title="Toilets" />
            <Card.Content>
              <Paragraph>{location?.toilets}</Paragraph>
            </Card.Content>
          </ScrollView>
        </Card>
      </List.Accordion>
    </List.Section>
    // </List.AccordionGroup>
  );
}
