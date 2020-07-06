import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {List} from 'react-native-paper';
export default function AccordionMenu({
  testID,
  location,
  selectedUsers,
  numberOfMentors,
  mentors,
}) {
  return (
    <List.AccordionGroup>
      <List.Accordion
        testId="mentors-accordian"
        title={`Mentors (${mentors?.length}/${numberOfMentors})`}
        id="1">
        {mentors?.map((mentor, i) => (
          <List.Item
            id={`mentor-${i + 1}`}
            title={`${i + 1}) ${mentor?.data?.firstName} ${
              mentor?.data?.lastName
            }`}
          />
        ))}
      </List.Accordion>
      <List.Accordion title={`Attendees (${selectedUsers.length})`} id="2">
        {selectedUsers?.map((user, i) => (
          <List.Item
            testId="attendees-accordian"
            id={`attendee-${i + 1}`}
            title={
              user.data
                ? `${i + 1}) ${user?.data?.firstName} ${user?.data?.lastName}`
                : `${i + 1}) ${user?.firstName} ${user?.lastName}`
            }
          />
        ))}
      </List.Accordion>
      <List.Accordion title="Location" id="3" testId="location-accordian">
        <List.Item
          title="Address"
          description={() => (
            <>
              <Text>{location?.data?.Address?.SecondLine}</Text>
              <Text>{location?.data?.Address?.FirstLine}</Text>
              <Text>{location?.data?.Address?.PostCode}</Text>
            </>
          )}
        />
        <List.Item
          title="Parking"
          description={() => <Text>{location?.data?.Parking}</Text>}
        />
        <List.Item
          title="Toilets"
          description={() => <Text>{location?.data?.Toilets}</Text>}
        />
        <List.Item
          title="Map"
          description={() => <Text>Coming soon...</Text>}
        />
      </List.Accordion>
    </List.AccordionGroup>
  );
}
