// TO DO - merge this with session/EditSession.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
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
import getCoverImage from '../../utils/getCoverImage';

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
  const CoverImage = getCoverImage(location);

  return (
    <SafeAreaView>
      <ScrollView testID="session-details-scroll-view">
        <Image source={CoverImage} />
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
            console.log(userData);
            createSessionInFirestore({
              sessionType,
              location,
              numberOfVolunteers,
              selectedUsers,
              dateTimeArray,
              descriptionOfSession,
              coordinator: userData?.Name || '',
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
          {sessionType} - {location.name}
        </Text>
        <Text>Coordinator</Text>
        <Text testID="coordinator-name">{userData?.Name}</Text>
        <Text>Description of session</Text>
        <TextInput
          testID="description-of-session"
          defaultValue={descriptionOfSession}
          onChangeText={(text) => setDescriptionOfSession(text)}
        />
        <AccordianMenu
          testID="mentors-accordian"
          title={`Mentors (0/${numberOfVolunteers})`}
        />
        <AccordianMenu
          testID="attendees-accordian"
          type="attendees"
          title={`Attendees (${selectedUsers.length})`}
          data={selectedUsers}
        />
        <AccordianMenu
          testID="location-accordian"
          type="location"
          title="Location"
          data={location}
        />
      </ScrollView>
    </SafeAreaView>
  );
}