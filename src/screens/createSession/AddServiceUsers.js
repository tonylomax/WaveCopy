import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput, FlatList} from 'react-native';
import {searchFirestoreServiceUsers} from '../../utils';
const EXAMPLE_LIST_OF_USERS = [
  {name: 'john1', id: 1},
  {name: 'john2', id: 2},
  {name: 'john3', id: 3},
];
const SEARCH_DELAY = 2000;

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
    setSearchResults([]);
    setSearchTerm(text);
    if (!typing) setTyping(true);
    if (loading) setLoading(false);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    if (text.length > 0) {
      const newTimeout = setTimeout(() => {
        console.log('searching for ', text);
        setLoading(true);
        // Set generic search results
        setSearchResults([
          {name: 'john2', id: 2},
          {name: 'john3', id: 3},
        ]);
        // Get the query responses
        searchFirestoreServiceUsers(text).then((realSearchResults) => {
          setLoading(false);
          setSearchResults(realSearchResults.hits);
        });
      }, 1000);
      setTypingTimeout(newTimeout);
    }
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
            return (
              <View>
                <Text key={`text-not-added-${item.id}`} testID={item.name}>
                  {item?.firstName} {item?.lastName}
                </Text>
                <Button
                  key={`button-not-added-${item.id}`}
                  title="Add user"
                  onPress={() => {
                    console.log('clicked selected user');
                    // Add the user if they have not already been selected
                    const found = selectedUsers.some(
                      (user) => user.id === item.id,
                    );
                    if (!found) {
                      setSelectedUsers((currentlySelected) =>
                        currentlySelected.concat(item),
                      );
                    }
                    setLoading(false);
                    setTyping(false);
                    setSearchTerm('');
                    setSearchResults([]);
                  }}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item?.id}
        />
      )}

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
