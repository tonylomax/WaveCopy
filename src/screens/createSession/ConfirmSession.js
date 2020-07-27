// TO DO - merge this with session/EditSession.js
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, Image, SafeAreaView, Alert, Button} from 'react-native';
import {
  Title,
  Divider,
  Headline,
  Subheading,
  Caption,
  Paragraph,
  TextInput,
  IconButton,
  Card,
} from 'react-native-paper';
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
import {CommonActions, useNavigationState} from '@react-navigation/native';
import {
  createSessionInFirestore,
  getCoverImage,
  updateSessionInFirestore,
} from 'utils';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';

export default function ConfirmSession({route, navigation}) {
  const {
    sessionType,
    location,
    numberOfVolunteers,
    selectedUsers,
    dateTimeArray,
    previousSessionData,
    previouslySelectedMentors,
    previousSessionID,
    editedDescriptionOfSession,
  } = route.params;

  //LOCAL STATE
  const [visible, setVisible] = useState(false);
  const [descriptionOfSession, setDescriptionOfSession] = useState(
    editedDescriptionOfSession && editedDescriptionOfSession.length > 0
      ? editedDescriptionOfSession
      : previousSessionData?.description
      ? previousSessionData?.description
      : '',
  );
  const [CoverImage, setCoverImage] = useState();
  //LOCAL STATE

  //REDUX STATE
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  //REDUX STATE

  useEffect(() => {
    setCoverImage(getCoverImage(location));
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="check"
          size={35}
          testID="confirm-session-details"
          // title="Confirm"
          onPress={() => setVisible((visible) => !visible)}
        />
      ),
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => {
            console.log({descriptionOfSession});
            navigation.navigate('AddServiceUsers', {
              editedDescriptionOfSession: descriptionOfSession,
            });
          }}
          title="Back"
        />
      ),
    });

    return () => {};
  }, [descriptionOfSession]);

  const state = useNavigationState((state) => state);

  console.log('state in confirm session', state);

  React.useEffect(() => {
    // parent = navigation.dangerouslyGetParent();
    // state = navigation.dangerouslyGetState();
    // console.log('state in confirm session', state);
    // console.log('parent in confirm session', parent);
    // let unsubscribe;
    // // if ((state.index = 4)) {
    // unsubscribe = parent.addListener('tabPress', (e) => {
    //   e.preventDefault();
    //   console.log('EVENT IN CONFIRMSESSION', e);
    // });
    // }
    // return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView>
        <Image style={{alignSelf: 'center', height: 150}} source={CoverImage} />

        <ChoicePopup
          testID="choicePopup"
          choiceText={`${
            previousSessionData ? 'Submit edited session' : 'Confirm session'
          }`}
          visible={visible}
          setVisible={setVisible}
          yesAction={() => {
            console.log('creating a session');
            // console.log(userData);
            console.log('previous session data', previousSessionID);
            console.log(previousSessionID);
            if (!previousSessionID) {
              createSessionInFirestore({
                sessionType,
                location,
                numberOfVolunteers,
                selectedUsers,
                dateTimeArray,
                descriptionOfSession,
                coordinator: userData?.firstName ? `${userData.firstName}` : '',
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
                .catch((err) => console.log(err));
            } else {
              updateSessionInFirestore({
                sessionType,
                location,
                numberOfVolunteers,
                selectedUsers,
                dateTimeArray,
                descriptionOfSession,
                coordinator: userData?.firstName ? `${userData.firstName}` : '',
                uid,
                sessionID: previousSessionID,
              })
                .then(() => {
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
            }
          }}></ChoicePopup>
        <Headline>
          {sessionType === 'surf-club' ? 'Surf Club' : 'Surf Therapy'} -{' '}
          {location.name}
        </Headline>
        <Divider />
        {dateTimeArray &&
          dateTimeArray.map((dateTimeOfSession, i) => (
            <Card style={{padding: '5%', margin: '2%'}}>
              {dateTimeArray.length > 1 ? (
                <Card.Title title={`Session ${i + 1}`} />
              ) : (
                <Card.Title title="Time and date" />
              )}

              <Card.Content>
                <Moment
                  element={Text}
                  // format="Do MMMM YYYY HH:mm"
                  format="LLLL"
                  key={`date-of-session-${i}`}>
                  {dateTimeOfSession}
                </Moment>
              </Card.Content>
            </Card>
          ))}

        <Divider />
        <Card style={{padding: '5%', margin: '2%'}}>
          <Card.Title title="Coordinator" />
          <Card.Content>
            <Paragraph testID="coordinator-name">
              {userData?.firstName} {userData?.lastName}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={{margin: '2%'}} elevation={2}>
          <Card.Title title="Description of session" />
          <Card.Content>
            <TextInput
              testID="description-of-session"
              defaultValue={descriptionOfSession}
              onChangeText={(text) => setDescriptionOfSession(text)}
            />
          </Card.Content>
        </Card>
        <SessionDetailsAccordionMenu
          location={location}
          selectedUsers={selectedUsers}
          numberOfMentors={numberOfVolunteers}
          mentors={previouslySelectedMentors || []}
          route={route}
          navigation={navigation}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
