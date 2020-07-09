import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {List} from 'react-native-paper';
import {AddButton, CloseButton} from 'components';
import {useSelector, useDispatch} from 'react-redux';

export default function AccordionMenu({
  testID,
  location,
  selectedUsers,
  numberOfMentors,
  mentors,
  assignSessionLead,
  unassignSessionLead,
  sessionLead,
  sessionID,
  roles,
}) {
  React.useEffect(() => {
    console.log('mentors', mentors);
  }, []);

  React.useEffect(() => {
    console.log('roles in accordion', roles);
  }, [roles]);

  const userData = useSelector((state) => state.firestoreReducer.userData);

  return (
    <List.AccordionGroup>
      <List.Accordion
        testID="mentors-accordian"
        title={`Mentors (${mentors?.length || 0}/${numberOfMentors})`}
        id="1">
        {mentors?.length > 0 &&
          mentors?.map((mentor, i) => (
            <List.Item
              key={`mentor-${i + 1}`}
              title={`${i + 1}) ${mentor?.firstName} ${mentor?.lastName}`}
              right={() => {
                return (
                  roles.some(
                    () =>
                      userData?.Roles?.includes('SurfLead') ||
                      userData?.Roles?.includes('NationalAdmin') ||
                      userData?.Roles?.includes('Coordinator'),
                  ) && (
                    <>
                      <AddButton
                        onPress={() => {
                          assignSessionLead(sessionID, mentor.id);
                        }}
                        title="Add"></AddButton>
                      <CloseButton
                        title="Remove"
                        onPress={() => {
                          unassignSessionLead(sessionID, mentor.id);
                        }}></CloseButton>
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
          selectedUsers?.map((user, i) => (
            <List.Item
              testId="attendees-accordian"
              key={`attendee-${i + 1}`}
              title={`${i + 1}) ${user?.firstName} ${user?.lastName}`}
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
