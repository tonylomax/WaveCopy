// TO DO - merge this with session/EditSession.js
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Image, SafeAreaView, Alert} from 'react-native';
import {
  ConfirmButton,
  ChoicePopup,
  SessionDetailsAccordionMenu,
} from 'components';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {CommonActions} from '@react-navigation/native';
import {createSessionInFirestore, getCoverImage} from 'utils';
import {useSelector} from 'react-redux';

export default function ConfirmSession({route, navigation}) {
  const {
    sessionType,
    location,
    numberOfVolunteers,
    selectedUsers,
    dateTimeArray,
  } = route.params;

  //LOCAL STATE
  const [visible, setVisible] = useState(false);
  const [descriptionOfSession, setDescriptionOfSession] = useState('');
  //LOCAL STATE

  //REDUX STATE
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  //REDUX STATE

  const CoverImage = getCoverImage(location);
  useEffect(() => {
    console.log('location', location);
  }, []);

  return (
    <SafeAreaView>
      <Image style={{alignSelf: 'center', height: 150}} source={CoverImage} />
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
            uid,
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
            .catch((err) => {
              console.log(err);
              //Needs testing, err may need serializing
              // Alert.alert(err);
            });
        }}></ChoicePopup>
      {dateTimeArray &&
        dateTimeArray.map((dateTimeOfSession, i) => (
          <Moment
            element={Text}
            format="Do MMMM YYYY HH:mm"
            key={`date-of-session-${i}`}>
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
      <SessionDetailsAccordionMenu
        location={location}
        selectedUsers={selectedUsers}
        numberOfMentors={numberOfVolunteers}
        mentors={[]}
      />
    </SafeAreaView>
  );
}
