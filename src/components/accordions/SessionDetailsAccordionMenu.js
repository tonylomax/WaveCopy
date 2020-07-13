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
  testID,
  location,
  selectedUsers,
  numberOfMentors,
  mentors,
  sessionLead,
  sessionID,
  roles,
}) {
  React.useEffect(() => {
    console.log('mentors', mentors);
  }, [mentors]);

  React.useEffect(() => {
    console.log('roles in sessionLead', sessionLead);
  }, [sessionLead]);

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
                navigation.navigate('Volunteer Profile', {mentor});
              }}
              key={`mentor-${i + 1}`}
              title={`${i + 1}) ${mentor?.firstName} ${mentor?.lastName}`}
              right={() => {
                return (
                  roles.some(
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
                          );
                        }}
                        title="Remove as Mentor"></CloseButton>
                      {sessionLead?.id === mentor.id ? (
                        <CloseButton
                          title="Remove as Lead"
                          onPress={() => {
                            unassignSessionLead(sessionID, mentor.id, UID);
                          }}></CloseButton>
                      ) : (
                        <AddButton
                          onPress={() => {
                            assignSessionLead(sessionID, mentor.id, UID);
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
        title={`Attendees (${selectedUsers.length})`}
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
                  navigation.navigate('ServiceUser Profile', {
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
