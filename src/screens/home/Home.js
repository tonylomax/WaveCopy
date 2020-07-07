import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getAllBeaches} from '../../redux/';
import {ConfirmButton, ChoicePopup} from 'components';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {isEmpty} from 'lodash';
import {
  subscribeToSessions,
  subscribeToRoleSpecificSessionChanges,
} from 'utils';

export default function Profile({navigation}) {
  const dispatch = useDispatch();
  //REDUX STATE

  const sessions = useSelector((state) => state.firestoreReducer.sessionData);

  const beaches = useSelector((state) => state.firestoreReducer.beaches);
  const roleSessions = useSelector(
    (state) => state.firestoreReducer.roleSpecificSessionData,
  );
  const userData = useSelector((state) => state.firestoreReducer.userData);

  const getBeach = (beachID) => beaches.filter((beach) => (beach.id = beachID));

  //LOCAL STATE
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let unsubscribeFromSessions = () => {};
    let unsubscribeFromRoleSessions = () => {};
    if (!isEmpty(userData)) {
      if (userData?.Roles.includes('NationalAdmin')) {
        console.log(userData?.firstName, 'IS NationalAdmin');
        unsubscribeFromSessions = subscribeToSessions();
      } else {
        console.log(userData?.firstName, 'IS NOT NationalAdmin');
        console.log('calling updateRoleSpecificSessions');
        unsubscribeFromRoleSessions = subscribeToRoleSpecificSessionChanges(
          userData.Region,
        );
      }
      dispatch(getAllBeaches());
      return () => {
        console.log('unsubscribing from sessions');
        unsubscribeFromSessions();
        unsubscribeFromRoleSessions();
      };
    }
  }, [userData]);

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
                console.log({item});
                navigation.navigate('Session', {item, selectedBeach});
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
                <Text>
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
