import React, {useEffect} from 'react';
import {Text, Alert} from 'react-native';
import {List} from 'react-native-paper';

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
              title={`${i + 1}) ${mentor?.firstName} ${mentor?.lastName}`}
              right={() => {
                return (
                  roles?.some(
                    () =>
                      userData?.Roles?.includes('SurfLead') ||
                      userData?.Roles?.includes('NationalAdmin') ||
                      userData?.Roles?.includes('Coordinator') ||
                      sessionLead?.id === UID,
                  ) && (
                    <>
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
                            unassignSessionLead(
                              sessionID,
                              mentor.id,
                              UID,
                            ).catch((err) => {
                              console.log('ERROR OUTSIDE TRANSACTION ', err);
                              Alert.alert(err);
                            });
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
                    </>
                  )
                );
              }}
            />
          ))}
      </List.Accordion>
      <List.Accordion
        title={`Attendees (${selectedUsers?.length})`}
        id="2"
        testID="attendees-accordian">
        {selectedUsers.length > 0 &&
          selectedUsers?.map((serviceUser, i) => (
            <List.Item
              onPress={() => {
                if (
                  roles.some(
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
              title={`${i + 1}) ${serviceUser?.firstName} ${
                serviceUser?.lastName
              }`}
            />
          ))}
      </List.Accordion>
      <List.Accordion title="Location" id="3" testID="location-accordian">
        <List.Item
          title="Address"
          description={() => (
            <>
              <Text>{location?.Address?.SecondLine}</Text>
              <Text>{location?.Address?.FirstLine}</Text>
              <Text>{location?.Address?.PostCode}</Text>
            </>
          )}
        />
        <List.Item
          title="Parking"
          description={() => <Text>{location?.Parking}</Text>}
        />
        <List.Item
          title="Toilets"
          description={() => <Text>{location?.Toilets}</Text>}
        />
        <List.Item
          title="Map"
          description={() => <Text>Coming soon...</Text>}
        />
      </List.Accordion>
    </List.AccordionGroup>
  );
}
