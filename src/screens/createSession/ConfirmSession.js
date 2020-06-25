// TO DO - merge this with session/EditSession.js
import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import AccordianMenu from '../../components/AccordianMenu';
import {ConfirmButton, ChoicePopup} from '../../components';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function ConfirmSession({route, navigation}) {
  const [visible, setVisible] = useState(false);
  const {
    sessionType,
    sessionDate,
    sessionTime,
    location,
    numberOfVolunteers,
    selectedUsers,
  } = route.params;

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
          navigation.navigate('SessionDetails');
        }}></ChoicePopup>
      <Moment testID="time-of-session" element={Text} format="HH:MM">
        {sessionTime}
      </Moment>
      <Moment testID="date-of-session" element={Text} format="Do MMMM YYYY">
        {sessionDate}
      </Moment>
      {/* <Text testID="date-of-session">{sessionDate}</Text> */}
      <Text>
        {sessionType} - {location}
      </Text>
      <Text>Coordinator</Text>

      <Text testID="coordinator-name">Test coordinator</Text>
      <Text>Description of session</Text>
      <TextInput testID="description-of-session" />
      <AccordianMenu testID="mentors-accordian" />
      <AccordianMenu testID="attendees-accordian" />
      <AccordianMenu testID="location-accordian" />
    </View>
  );
}
