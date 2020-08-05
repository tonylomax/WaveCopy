import React, {useEffect, useState} from 'react';
import {Alert, View, StyleSheet, Linking} from 'react-native';
import {
  List,
  Divider,
  Card,
  Paragraph,
  IconButton,
  Button,
} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';

import {
  ConfirmButton,
  CloseButton,
  VolunteerAvatar,
  SurferAvatar,
} from 'components';
import {useSelector} from 'react-redux';
import {
  assignSessionLead,
  unassignSessionLead,
  removeMentorFromSession,
} from 'utils';
import {ScrollView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-swipeable';
import moment from 'moment';
moment.locale('en-gb');
moment().format('en-gb');
import 'moment/src/locale/en-gb';

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
  //REDUX STATE
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  const [mentorsExpanded, setMentorsExpanded] = useState(false);
  const [attendeesExpanded, setAttendeesExpanded] = useState(false);
  //REDUX STATE

  useEffect(() => {
    console.log('mentors', mentors);
  }, [mentors]);

  return (
    <List.Section>
      {/* MENTOR ACCORDION MENU */}
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
              <View style={{justifyContent: 'space-between'}}>
                <ConfirmButton
                  style={{
                    width: '95%',
                    maxWidth: '95%',
                    maxHeight: '45%',
                    marginHorizontal: '1%',
                    fontSize: 13,
                  }}
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
                  title="Remove as Mentor"></ConfirmButton>
                {sessionLead?.id === mentor.id ? (
                  <CloseButton
                    style={{
                      fontSize: 12,
                      marginHorizontal: '1%',
                      minWidth: '95%',
                      width: '95%',
                      maxWidth: '95%',
                      maxHeight: '45%',
                    }}
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
                    style={{
                      marginHorizontal: '1%',
                      fontSize: 12,
                      width: '95%',
                      minWidth: '95%',
                      maxWidth: '95%',
                      maxHeight: '45%',
                    }}
                    onPress={() => {
                      assignSessionLead(sessionID, mentor.id, uid).catch(
                        (err) => {
                          console.log('ERROR OUTSIDE TRANSACTION ', err);
                          Alert.alert(err);
                        },
                      );
                    }}
                    title="Add as Lead"></ConfirmButton>
                )}
              </View>,
            ];
            return (
              <View>
                <Swipeable
                  rightButtonWidth={175}
                  rightButtons={
                    roles?.some(
                      () =>
                        userData?.roles?.includes('SurfLead') ||
                        userData?.roles?.includes('NationalAdmin') ||
                        userData?.roles?.includes('Coordinator') ||
                        sessionLead?.id === uid,
                    ) && rightButtons
                  }
                  rightButtonContainerStyle={{
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: 'white',
                    flex: 1,
                    height: 110,
                    width: 160,
                    top: 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'space-around',
                  }}>
                  <Card
                    key={`mentor-${i + 1}`}
                    style={{margin: '2%'}}
                    onPress={() => {
                      if (route.name !== 'ConfirmSession') {
                        const routeDestination =
                          route.name === 'HomeSession'
                            ? 'Home Volunteer Profile'
                            : 'Profile Volunteer Profile';
                        navigation.navigate(routeDestination, {mentor});
                      }
                    }}>
                    <Card.Content
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <VolunteerAvatar
                        label={`${mentor?.firstName.charAt(
                          0,
                        )}${mentor?.lastName.charAt(0)}`}
                        isProfilePicture={true}
                        size={'SMALL'}
                        style={{
                          alignSelf: 'flex-start',
                          marginRight: '7.5%',
                        }}></VolunteerAvatar>
                      <Paragraph style={{fontSize: 16, maxWidth: '75%'}}>
                        {`${mentor?.firstName} ${mentor?.lastName}${
                          mentor?.dateOfBirth
                            ? ', ' + moment().diff(mentor.dateOfBirth, 'years')
                            : ''
                        } `}{' '}
                      </Paragraph>
                      <IconButton
                        style={{
                          position: 'absolute',
                          top: 10,
                          bottom: 10,
                          right: 5,
                          // marginVertical: '2%',
                          // paddingVertical: '2%',
                        }}
                        icon="chevron-double-left"
                        color={'grey'}
                        size={50}
                        disabled={true}
                      />
                    </Card.Content>
                  </Card>
                </Swipeable>
              </View>
            );
          })}
        {/* MENTOR ACCORDION MENU */}
      </List.Accordion>

      {/* SURFER ACCORDION MENU */}
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
          selectedUsers?.map((serviceUser, i) => {
            const rightButtons = [
              <ConfirmButton
                title="Call Parent"
                style={{
                  width: '95%',
                  maxWidth: '95%',
                  maxHeight: '45%',
                  marginHorizontal: '1%',
                  fontSize: 13,
                }}
                testID={`removeAsMentorButton${serviceUser.id}`}
                onPress={async () => {
                  await Linking.openURL(`tel:${serviceUser?.number}`).catch(
                    (err) => {
                      console.log(err);
                    },
                  );
                }}></ConfirmButton>,
            ];

            return (
              <View>
                <Swipeable
                  rightButtonWidth={175}
                  rightButtons={
                    roles?.some(
                      () =>
                        userData?.roles?.includes('SurfLead') ||
                        userData?.roles?.includes('NationalAdmin') ||
                        userData?.roles?.includes('Coordinator') ||
                        sessionLead?.id === uid,
                    ) && rightButtons
                  }
                  rightButtonContainerStyle={{
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: 'white',
                    flex: 1,
                    height: 105,
                    width: 160,
                    top: 8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'space-around',
                  }}>
                  <Card
                    key={`attendee-${i + 1}`}
                    style={{margin: '2%'}}
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
                        console.log(
                          'route name in profile on click',
                          route.name,
                        );
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
                    }}>
                    <Card.Content
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <VolunteerAvatar
                        label={`${serviceUser?.firstName?.charAt(
                          0,
                        )}${serviceUser?.lastName?.charAt(0)}`}
                        isProfilePicture={true}
                        size={'SMALL'}
                        style={{
                          alignSelf: 'flex-start',
                          marginRight: '7.5%',
                        }}></VolunteerAvatar>
                      <Paragraph style={{fontSize: 16, maxWidth: '75%'}}>
                        {`${serviceUser?.firstName} ${serviceUser?.lastName}${
                          serviceUser?.dateOfBirth
                            ? ', ' +
                              moment().diff(serviceUser.dateOfBirth, 'years')
                            : ''
                        } `}
                      </Paragraph>

                      {route.name !== 'ConfirmSession' && (
                        <IconButton
                          style={{
                            position: 'absolute',
                            top: 10,
                            bottom: 10,
                            right: 5,
                          }}
                          icon="chevron-double-left"
                          color={'grey'}
                          size={50}
                          disabled={true}
                        />
                      )}
                    </Card.Content>
                  </Card>
                </Swipeable>
              </View>
            );
          })}
        {/* SURFER ACCORDION MENU */}
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
  );
}
