// TO DO - merge this with session/EditSession.js
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  SafeAreaView,
  Alert,
  Button,
} from 'react-native';
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
  Portal,
  Modal,
  useTheme,
} from 'react-native-paper';
import {
  ConfirmButton,
  CloseButton,
  SessionDetailsAccordionMenu,
  BackButton,
  ChoicePopup,
} from 'components';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {
  CommonActions,
  useNavigationState,
  useIsFocused,
} from '@react-navigation/native';
import {
  createSessionInFirestore,
  getCoverImage,
  updateSessionInFirestore,
} from 'utils';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import {coverWave} from '../../assets/';
export default function ConfirmSession({route, navigation}) {
  const {fonts} = useTheme();
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
  const [descriptionOfSession, setDescriptionOfSession] = useState(
    editedDescriptionOfSession && editedDescriptionOfSession.length > 0
      ? editedDescriptionOfSession
      : previousSessionData?.description
      ? previousSessionData?.description
      : '',
  );
  const [CoverImage, setCoverImage] = useState();
  const [confirmSessionModalVisible, setConfirmSessionModalVisible] = useState(
    false,
  );

  const toggleConfirmSessionModal = () =>
    setConfirmSessionModalVisible(
      (confirmSessionModalVisible) => !confirmSessionModalVisible,
    );
  //LOCAL STATE

  //REDUX STATE
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  //REDUX STATE

  useEffect(() => {
    setCoverImage(coverWave);
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          color="white"
          icon="check"
          size={36}
          testID="confirm-session-details"
          onPress={() => setVisible((visible) => !visible)}
          onPress={() => toggleConfirmSessionModal()}
        />
      ),
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            console.log({descriptionOfSession});
            navigation.navigate('AddServiceUsers', {
              editedDescriptionOfSession: descriptionOfSession,
            });
          }}
        />
      ),
    });

    return () => {};
  }, [descriptionOfSession]);

  return (
    <SafeAreaView>
      <ScrollView>
        <ImageBackground
          style={{height: 175, width: '100%'}}
          source={CoverImage}>
          {/* Edit session button */}
        </ImageBackground>
        <Portal>
          <Modal
            style={{alignContent: 'center'}}
            visible={confirmSessionModalVisible}
            onDismiss={toggleConfirmSessionModal}>
            <Card>
              <Card.Title
                titleStyle={{alignSelf: 'center'}}
                title={`${
                  previousSessionData
                    ? 'Would you like to save your changes?'
                    : 'Confirm session'
                }`}
              />
              <Card.Content>
                <ConfirmButton
                  title="Yes"
                  onPress={() => {
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
                        coordinator: userData?.firstName
                          ? `${userData.firstName}`
                          : '',
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
                        coordinator: userData?.firstName
                          ? `${userData.firstName}`
                          : '',
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
                  }}></ConfirmButton>
                <CloseButton
                  title="No"
                  onPress={() => {
                    toggleConfirmSessionModal();
                  }}></CloseButton>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>

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
