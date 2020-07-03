import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {subscribeToAllSessions, getAllBeaches} from '../../redux/';
import {ConfirmButton, ChoicePopup} from 'components';
import {TouchableHighlight} from 'react-native-gesture-handler';

export default function Profile({navigation}) {
  const dispatch = useDispatch();
  //REDUX STATE
  const sessions = useSelector((state) => state.firestoreReducer.sessionData);

  //LOCAL STATE
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribeFromSessions = dispatch(subscribeToAllSessions());
    dispatch(getAllBeaches());
    return () => {
      console.log('unsubscribing from sessions');
      // unsubscribeFromSessions();
      // When this is called at the moment the error
      // is that unsubscribe is an unresolved promise
    };
  }, []);

  // useEffect(() => {
  //   console.log('SESSION', sessions);
  // }, [sessions]);

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
          data={sessions}
          renderItem={({item}) => (
            <TouchableHighlight
              onPress={() => {
                navigation.navigate('Session', {item});
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
          keyExtractor={(item) => item.ID}
        />
      </View>
    </SafeAreaView>
  );
}
