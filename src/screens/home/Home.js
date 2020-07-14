import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getAllBeaches} from '../../redux/';
import {ConfirmButton, ChoicePopup} from 'components';
import {isEmpty} from 'lodash';
import {
  subscribeToSessions,
  subscribeToRoleSpecificSessionChanges,
} from 'utils';

export default function Profile({navigation}) {
  const dispatch = useDispatch();

  //LOCAL STATE
  const [visible, setVisible] = useState(false);
  //LOCAL STATE

  //REDUX STATE
  const sessions = useSelector((state) => state.firestoreReducer.sessionData);
  const beaches = useSelector((state) => state.firestoreReducer.beaches);
  const roleSessions = useSelector(
    (state) => state.firestoreReducer.roleSpecificSessionData,
  );
  const userData = useSelector((state) => state.firestoreReducer.userData);
  //REDUX STATE

  const getBeach = (beachID) => beaches.filter((beach) => (beach.id = beachID));

  useEffect(() => {
    let unsubscribeFromSessions = () => {};
    let unsubscribeFromRoleSessions = () => {};
    // Check to see if there is user data
    if (!isEmpty(userData)) {
      //If the user is a national admin then set up a subscription too all sessions
      if (userData?.Roles.includes('NationalAdmin')) {
        unsubscribeFromSessions = subscribeToSessions();
      } else {
        // Otherwise set up a subscription to sessions restricted to the users area
        unsubscribeFromRoleSessions = subscribeToRoleSpecificSessionChanges(
          userData.Region,
        );
      }
      // Get the latest beach information
      dispatch(getAllBeaches());
      return () => {
        console.log('unsubscribing from sessions');
        unsubscribeFromSessions();
        unsubscribeFromRoleSessions();
      };
    }
  }, [userData]);

  // useEffect(() => {
  //   console.log('beaches', beaches);
  // }, [beaches]);

  return (
    <SafeAreaView>
      <View>
        <Text>Home</Text>
        <Text testID="upcoming-sessions-title">Upcoming sessions</Text>
        <ConfirmButton
          testID="modalButton"
          title="Modal"
          onPress={() => setVisible((visible) => !visible)}></ConfirmButton>
        <ChoicePopup
          testID="choicePopup"
          visible={visible}
          setVisible={setVisible}></ChoicePopup>

        <FlatList
          testID="SessionsList"
          data={
            userData?.Roles?.includes('NationalAdmin') ? sessions : roleSessions
          }
          renderItem={({item}) => (
            <TouchableHighlight
              onPress={() => {
                const selectedBeach = getBeach(item.ID)[0];
                // console.log({item});
                navigation.navigate('HomeSession', {item, selectedBeach});
              }}
              style={{
                borderColor: 'black',
                borderWidth: 2,
                marginBottom: '2%',
              }}>
              <View testID={`SessionsListItem${item.ID}`} id={item.ID}>
                <Text> {item?.Type} </Text>
                <Text> {item?.Beach} </Text>
                <Text> {item?.DateTime} </Text>
                <Text testID={`SessionsListItemVolNum${item.ID}`}>
                  Volunteers: {item?.Mentors?.length}/{item?.MaxMentors}
                </Text>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={(item) => item.ID}></FlatList>
      </View>
    </SafeAreaView>
  );
}
