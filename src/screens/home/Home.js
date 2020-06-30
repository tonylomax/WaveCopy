import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {subscribeToAllSessions, getAllBeaches} from '../../redux/';
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
import {TouchableHighlight} from 'react-native-gesture-handler';

export default function Profile({navigation}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('visible', visible);
  }, [visible]);

  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.firestoreReducer.sessionData);
  const beaches = useSelector((state) => state.firestoreReducer.beaches);

  useEffect(() => {
    dispatch(subscribeToAllSessions());
    if (!beaches) {
      dispatch(getAllBeaches());
    }
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
            <TouchableHighlight
              onPress={() => {
                navigation.navigate('Session', {item});
              }}
              style={{
                borderColor: 'black',
                borderWidth: 2,
                marginBottom: '2%',
              }}>
              <View testID={'SessionsListItem'} id={item.ID}>
                <Text> {item.Beach} </Text>
                <Text> {item.Description} </Text>
                <Text> {item.Beach} </Text>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={(item) => item.ID}
        />
      </View>
    </SafeAreaView>
  );
}
