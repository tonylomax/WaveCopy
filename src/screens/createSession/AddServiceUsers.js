import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
const EXAMPLE_LIST_OF_USERS = ['john1', 'john2', 'john3', 'joe-bloggs'];

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
          testID={serviceUser}
          onPress={() =>
            setSelectedUsers((currentlySelected) =>
              currentlySelected.concat(serviceUser),
            )
          }>
          {serviceUser}
        </Text>
      ))}
      <Text testID="currently-added-service-users">Currently Added</Text>
      {selectedUsers.map((serviceUser) => (
        <Text>{serviceUser}</Text>
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
