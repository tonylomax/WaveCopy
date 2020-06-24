import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {subscribeToAllSessions} from '../redux/actions/firestore';
import {
  ConfirmButton,
  AddButton,
  EditButton,
  CallPerson,
  CloseButton,
  PersonCardSession,
  RegisterTabs,
  LoadingScreen,
  ChoicePopup,
} from 'components';

export default function Profile({navigation}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('visible', visible);
  }, [visible]);

  const dispatch = useDispatch();
  const sessions = useSelector(
    (state) => state?.firestoreReducer?.action?.data,
  );

  useEffect(() => {
    dispatch(subscribeToAllSessions());
    console.log(sessions);
  }, []);

  return (
    <View>
      <Text>Profile</Text>
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
        testID={'SessionsList'}
        data={sessions}
        renderItem={({item}) => (
          <View testID={'SessionsListItem'} id={item.ID}>
            <Text> {item.Beach} </Text>
            <Text> {item.Description} </Text>
            <Text> {item.Beach} </Text>
          </View>
        )}
        keyExtractor={(item) => item.ID}
      />
    </View>
  );
}
