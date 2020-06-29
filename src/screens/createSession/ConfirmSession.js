// TO DO - merge this with session/EditSession.js
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import AccordianMenu from '../../components/AccordianMenu';
import {ConfirmButton, ChoicePopup} from '../../components';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {CommonActions} from '@react-navigation/native';
import createSessionInFirestore from '../../utils/createSessionInFirestore';
import {useSelector} from 'react-redux';

export default function ConfirmSession({route, navigation}) {
  const [visible, setVisible] = useState(false);
  const [descriptionOfSession, setDescriptionOfSession] = useState('');
  const {
    sessionType,
    location,
    numberOfVolunteers,
    selectedUsers,
    dateTimeArray,
  } = route.params;
  const userData = useSelector((state) => state.firestoreReducer.userData);
  return (
    <View>
      <ConfirmButton
        testID="confirm-session-details"
        title="Confirm"
        onPress={() => setVisible((visible) => !visible)}></ConfirmButton>
      <ChoicePopup
        testID="choicePopup"
        visible={visible}
        setVisible={setVisible}
        yesAction={() => {
          console.log('creating a session');
          createSessionInFirestore({
            sessionType,
            location,
            numberOfVolunteers,
            selectedUsers,
            dateTimeArray,
            descriptionOfSession,
            coordinator: userData.uid,
          })
            .then(() => {
              console.log('session created');
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              );
            })
            .catch((err) => console.log(err));
        }}></ChoicePopup>
      {dateTimeArray &&
        dateTimeArray.map((dateTimeOfSession) => (
          <Moment element={Text} format="Do MMMM YYYY HH:mm">
            {dateTimeOfSession}
          </Moment>
        ))}

      <Text>
        {sessionType} - {location}
      </Text>
      <Text>Coordinator</Text>

      <Text testID="coordinator-name">Test coordinator</Text>
      <Text>Description of session</Text>
      <TextInput
        testID="description-of-session"
        defaultValue={descriptionOfSession}
        onChangeText={(text) => setDescriptionOfSession(text)}
      />
      <AccordianMenu testID="mentors-accordian" />
      <AccordianMenu testID="attendees-accordian" />
      <AccordianMenu testID="location-accordian" />
    </View>
  );
}
