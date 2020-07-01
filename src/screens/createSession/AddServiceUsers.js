import React, {useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
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
  React.useEffect(() => {
    console.log({location});
  });

  return (
    <View>
      <Text>Search</Text>
      <TextInput />
      {EXAMPLE_LIST_OF_USERS.map((serviceUser) => (
        <Text
          key={`not-added-${serviceUser.name}`}
          testID={serviceUser.name}
          onPress={() => {
            console.log('clicked selected user');
            setSelectedUsers((currentlySelected) =>
              currentlySelected.concat(serviceUser),
            );
          }}>
          {serviceUser.name}
        </Text>
      ))}
      <Text testID="currently-added-service-users">Currently Added</Text>
      {selectedUsers.map((serviceUser) => (
        <View>
          <Text key={`currently-added-${serviceUser.name}`}>
            {serviceUser.name}
          </Text>
          <Button
            title="Remove"
            onPress={() => {
              const updatedSelectedUsers = selectedUsers.filter(
                (selectedUser) => selectedUser.id !== serviceUser.id,
              );
              setSelectedUsers(updatedSelectedUsers);
            }}
          />
        </View>
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
