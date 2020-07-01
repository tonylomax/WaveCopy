import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
const EXAMPLE_LIST_OF_USERS = [
  {name: 'john1', id: 1},
  {name: 'john2', id: 2},
  {name: 'john3', id: 3},
];

export default function AddServiceUsers({route, navigation}) {
  const {
    sessionType,
    location,
    numberOfVolunteers,
    dateTimeArray,
  } = route.params;
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <View>
      <Text>Search</Text>
      {EXAMPLE_LIST_OF_USERS.map((serviceUser) => (
        <Text
          key={`not-added-${serviceUser.name}`}
          testID={serviceUser.name}
          onPress={() =>
            setSelectedUsers((currentlySelected) =>
              currentlySelected.concat(serviceUser),
            )
          }>
          {serviceUser.name}
        </Text>
      ))}
      <Text testID="currently-added-service-users">Currently Added</Text>
      {selectedUsers.map((serviceUser) => (
        <Text key={`currently-added-${serviceUser.name}`}>
          {serviceUser.name}
        </Text>
      ))}
      <Button
        testID="continue-to-review-created-session-page"
        title="Continue"
        onPress={() =>
          navigation.navigate('ConfirmSession', {
            sessionType,
            location,
            numberOfVolunteers,
            selectedUsers,
            dateTimeArray,
          })
        }
      />
    </View>
  );
}
