import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {subscribeToAllSessions} from '../../redux/index';
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
  const sessions = useSelector((state) => state.firestoreReducer.sessionData);

  useEffect(() => {
    dispatch(subscribeToAllSessions());
  }, []);

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
            <View testID={'SessionsListItem'} id={item.ID}>
              <Text> {item.Beach} </Text>
              <Text> {item.Description} </Text>
              <Text> {item.Beach} </Text>
            </View>
          )}
          keyExtractor={(item) => item.ID}
        />
      </View>
    </SafeAreaView>
  );
}
