// TO DO - merge this with session/EditSession.js
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import AccordianMenu from '../../components/AccordianMenu';
import {ConfirmButton, ChoicePopup} from '../../components';
import generateDateTimeArray from '../../utils/time/repetitionDatesArray';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function ConfirmSession({route, navigation}) {
  const [visible, setVisible] = useState(false);
  const [startDateTime, setStartDateTime] = useState();
  const {
    sessionType,
    location,
    numberOfVolunteers,
    selectedUsers,
    dateTimeArray,
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
      {/* <Moment testID="time-of-session" element={Text} format="HH:MM">
        {sessionTime}
      </Moment>
      {sessionDate && (
        <Moment testID="date-of-session" element={Text} format="Do MMMM YYYY">
          {sessionDate}
        </Moment>
      )} */}

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
      <TextInput testID="description-of-session" />
      <AccordianMenu testID="mentors-accordian" />
      <AccordianMenu testID="attendees-accordian" />
      <AccordianMenu testID="location-accordian" />
    </View>
  );
}
