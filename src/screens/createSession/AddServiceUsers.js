import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput, FlatList} from 'react-native';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!typing && searchTerm.length > 0) {
      setLoading(true);
    }
  }, [typing]);

  const onTypeLetter = (text) => {
    setSearchTerm(text);
    if (!typing) setTyping(true);
    if (loading) setLoading(false);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const newTimeout = setTimeout(() => {
      console.log('searching for ', text);
      setLoading(true);
      // Set generic search results
      setSearchResults([
        {name: 'john2', id: 2},
        {name: 'john3', id: 3},
      ]);
      // Get the query responses
    }, 4000);
    setTypingTimeout(newTimeout);
  };

  return (
    <View>
      <Text>Search</Text>
      <TextInput
        onChangeText={(text) => onTypeLetter(text)}
        value={searchTerm}
        h
      />
      {loading && <Text>Loading...</Text>}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={({item}) => {
            console.log(item);
            return <Text>{item?.name} </Text>;
          }}
          keyExtractor={(item) => item?.id}
        />
      )}

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
