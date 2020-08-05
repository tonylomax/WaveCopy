import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  Searchbar,
  List,
  Card,
  Title,
  Divider,
  Paragraph,
} from 'react-native-paper';
import Highlighter from 'react-native-highlight-words';
import {searchFirestoreServiceUsers} from 'utils';
import {ConfirmButton, CloseButton, BackButton} from 'components';

export default function AddServiceUsers({route, navigation}) {
  const {
    previouslySelectedAttendees,
    editedDescriptionOfSession,
  } = route.params;

  //LOCAL STATE
  const [selectedUsers, setSelectedUsers] = useState(
    previouslySelectedAttendees || [],
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  //LOCAL STATE

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
        // Get the query responses
        searchFirestoreServiceUsers(text).then((realSearchResults) => {
          setLoading(false);
          setSearchResults(realSearchResults.hits);
        });
      }, 300);
      setTypingTimeout(newTimeout);
    }
  };
  const addUser = (item) => {
    console.log('adding item', item);
    // Add the user if they have not already been selected
    const found = selectedUsers.some((user) => {
      return user.objectID === item.objectID || user.id === item.objectID;
    });
    if (!found) {
      setSelectedUsers((currentlySelected) => currentlySelected.concat(item));
    }
    setLoading(false);
    setTyping(false);
    setSearchTerm('');
    setSearchResults([]);
  };
  const removeUser = (serviceUserID) => {
    const updatedSelectedUsers = selectedUsers.filter((selectedUser) => {
      // console.log({selectedUser});
      // console.log(selectedUser.objectID);
      // console.log(serviceUserID);
      return (
        selectedUser.objectID !== serviceUserID &&
        selectedUser.id !== serviceUserID
      );
    });
    setSelectedUsers(updatedSelectedUsers);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            console.log({editedDescriptionOfSession});
            console.log({selectedUsers});
            navigation.navigate('SessionDetails', {
              selectedUsers,
              editedDescriptionOfSession,
            });
          }}
        />
      ),
    });
    return () => {};
  }, [editedDescriptionOfSession, selectedUsers]);

  useEffect(() => {
    console.log({editedDescriptionOfSession});
  }, []);

  return (
    <SafeAreaView style={{marginBottom: '20%'}}>
      <View>
        <Searchbar
          onChangeText={(text) => onTypeLetter(text)}
          value={searchTerm}
        />
        {loading && <Text>Loading...</Text>}
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            renderItem={({item}) => {
              return (
                <View>
                  <List.Item
                    title={
                      <Highlighter
                        highlightStyle={{backgroundColor: '#F2EAA7'}}
                        searchWords={[searchTerm]}
                        textToHighlight={`${item?.firstName} ${item?.lastName}`}
                      />
                    }
                    right={() => (
                      <ConfirmButton
                        onPress={() => addUser(item)}
                        title="Add user"
                      />
                    )}
                  />
                  <Divider />
                </View>
              );
            }}
            keyExtractor={(item) => item?.id}
          />
        )}

        <Title testID="currently-added-service-users">Currently Added</Title>
        <FlatList
          style={{marginBottom: '30%'}}
          data={selectedUsers}
          renderItem={({item, index}) => {
            return (
              <View>
                <List.Item
                  titleNumberOfLines={2}
                  title={
                    <Highlighter
                      highlightStyle={{backgroundColor: '#F2EAA7'}}
                      searchWords={[searchTerm]}
                      textToHighlight={`${item?.firstName} ${item?.lastName} ${
                        item?.postcode
                          ? `\n(${item.postcode.substring(
                              0,
                              item.postcode.length - 3,
                            )})`
                          : ''
                      } `}
                    />
                  }
                  right={() => (
                    <CloseButton
                      title="remove"
                      onPress={() => {
                        console.log('clicked on id ', item?.objectID);
                        removeUser(item.objectID || item.id);
                      }}
                    />
                  )}
                />
                <Divider />
              </View>
            );
          }}
          ListFooterComponent={
            <ConfirmButton
              testID="continue-to-review-created-session-page"
              title="Continue"
              onPress={() => {
                console.log({editedDescriptionOfSession});
                navigation.push('ConfirmSession', {
                  selectedUsers,
                  ...route.params,
                  editedDescriptionOfSession,
                });
              }}
            />
          }
          keyExtractor={(item) => item?.id}
        />
      </View>
    </SafeAreaView>
  );
}
