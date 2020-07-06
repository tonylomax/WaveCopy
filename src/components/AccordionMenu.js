import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {List} from 'react-native-paper';
export default function AccordionMenu({
  testID,
  location,
  selectedUsers,
  numberOfVolunteers,
}) {
  useEffect(() => {
    console.log({selectedUsers});
    console.log(location);
    console.log({numberOfVolunteers});
  }, []);
  return (
    <List.AccordionGroup>
      <List.Accordion
        testId="mentors-accordian"
        title={`Mentors (0/${numberOfVolunteers})`}
        id="1"></List.Accordion>
      <List.Accordion title={`Attendees (${selectedUsers.length})`} id="2">
        {selectedUsers?.map((user, i) => (
          <List.Item
            testId="attendees-accordian"
            id={`attendee-${i + 1}`}
            title={`${i + 1}) ${user?.data?.firstName} ${user?.data?.lastName}`}
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
