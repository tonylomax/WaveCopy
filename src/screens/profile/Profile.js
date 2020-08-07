import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  ConfirmButton,
  CloseButton,
  TrainingAccordionMenu,
  SessionListAccordionMenu,
  VolunteerAvatar,
} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {Edit_Icon} from 'assets';
import {coverWave} from '../../assets/';
import ImagePicker from 'react-native-image-picker';
import {
  uploadFile,
  monitorFileUpload,
  updateOwnBio,
  getImageDownloadURI,
  signOut,
  updateOwnContactNumber,
} from 'utils';
import {
  Avatar,
  Title,
  TextInput,
  Paragraph,
  Portal,
  Modal,
  Card,
  ProgressBar,
  Subheading,
} from 'react-native-paper';

import {ResetPassword} from 'components';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {
  updateRoleSpecificSessions,
  updateSessions,
  updateFirestoreUserData,
} from '../../redux/';

export default function Profile({navigation, route}) {
  const dispatch = useDispatch();
  //REDUX STATE
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );

  const sessions = useSelector((state) => state.firestoreReducer.sessionData);

  const pastSessions = useSelector((state) =>
    state.firestoreReducer.sessionData.filter(
      (session) => session.dateTime < moment(new Date()).format(),
    ),
  );

  const upcomingSessions = useSelector((state) =>
    state.firestoreReducer.sessionData.filter(
      (session) => session.dateTime >= moment(new Date()).format(),
    ),
  );

  // Finds all sessions that you are signed up for
  const mySessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData.filter((session) =>
      session?.mentors.some((mentor) => mentor.id === uid),
    ),
  );

  const myPastSessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData
      .filter((session) => session.dateTime < moment(new Date()).format())
      .filter((session) =>
        session?.mentors.some((mentor) => mentor.id === uid),
      ),
  );

  const myUpcomingSessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData
      .filter((session) => session.dateTime >= moment(new Date()).format())
      .filter((session) =>
        session?.mentors.some((mentor) => mentor.id === uid),
      ),
  );
  const storedProfileURL = useSelector(
    (state) => state.firebaseStorageReducer.downloadURI,
  );

  const beaches = useSelector((state) => state.firestoreReducer.beaches);
  //REDUX STATE

  //LOCAL STATE
  const [bio, setBio] = useState(userData?.bio);
  const [contactNumber, setContactNumber] = useState(userData?.contactNumber);
  const [profileURL, setProfileURL] = useState('');
  const [editBio, setEditBio] = useState(false);
  const [editContactNumber, setEditContactNumber] = useState(false);
  const [imageConfirmPopup, setImageConfirmPopup] = useState(false);
  const [localFilePath, setLocalFilePath] = useState();
  const [
    newProfilePicUploadComplete,
    setNewProfilePicUploadComplete,
  ] = useState(false);
  const [options, setOptions] = useState({
    title: 'Select Profile Pic',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    noData: true,
  });
  const [uploadImg, setUploadImg] = useState();
  const [uploadProgress, setuploadProgress] = useState(0);
  const [showProgressBar, setshowProgressBar] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(
    false,
  );

  //LOCAL STATE
  const togglePasswordChangeModal = () =>
    setChangePasswordModalVisible(
      (changePasswordModalVisible) => !changePasswordModalVisible,
    );

  const getFileLocalPath = (response) => {
    const {path, uri} = response;
    return Platform.OS === 'android' ? path : uri;
  };

  useEffect(() => {
    console.log('uid', uid);
    getImageDownloadURI(uid);
  }, [newProfilePicUploadComplete]);

  useEffect(() => {
    getImageDownloadURI(uid);
  }, []);

  useEffect(() => {
    console.log('storedProfileURL', storedProfileURL);
    if (storedProfileURL) {
      setProfileURL(storedProfileURL);
    }
  }, [storedProfileURL]);

  // Could be imported as a component
  const imagePicker = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setUploadImg({uri: response.uri});
        setLocalFilePath(getFileLocalPath(response));
        const fileSize = response.fileSize;
        //To-Do: determine max image file size we'll allow
        // if (fileSize > 10000) {
        //   Alert.alert(
        //     'Image is too big, please select a lower quality image',
        //   );
        // } else
        //display the image and if they click yes then start the upload
        setImageConfirmPopup(true);
      }
    });
  };

  return (
    // <SafeAreaView style={{flex: 1}}>
    <ScrollView
      testID="profile-scroll-view"
      bounces={false}
      // style={{width: '100%'}}
    >
      <View
        style={{
          flex: 1,
        }}>
        <ImageBackground
          style={{height: 175, width: '100%'}}
          source={coverWave}></ImageBackground>

        <Portal>
          <Modal
            visible={imageConfirmPopup}
            onDismiss={() => setImageConfirmPopup(false)}>
            <Card>
              <Card.Title
                titleStyle={{
                  fontSize: 16,
                  padding: 0,
                  alignSelf: 'center',
                }}
                style={{
                  marginHorizontal: '1%',
                  paddingLeft: '0%',
                  paddingRight: '0%',
                }}
                title="Are you happy with this new profile picture?"
              />
              <Card.Content>
                <VolunteerAvatar
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  testID="profilePic"
                  size="LARGE"
                  isProfilePicture={true}
                  source={{uri: uploadImg?.uri}}
                />
                <ProgressBar
                  style={{marginTop: '2.5%'}}
                  visible={showProgressBar}
                  progress={uploadProgress}
                />
              </Card.Content>
              <Card.Actions
                style={{
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                <ConfirmButton
                  style={{marginHorizontal: '5%', marginBottom: '1%'}}
                  title="Yes"
                  onPress={() => {
                    setshowProgressBar(true);
                    const task = uploadFile(localFilePath, uid);
                    monitorFileUpload(
                      task,
                      setuploadProgress,
                      newProfilePicUploadComplete,
                      setNewProfilePicUploadComplete,
                    ).then(() => {
                      setshowProgressBar(false);
                      setuploadProgress(0);
                      setImageConfirmPopup(false);
                    });
                  }}></ConfirmButton>
                <CloseButton
                  title="No"
                  onPress={() => {
                    setImageConfirmPopup(false);
                  }}></CloseButton>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>

        <Card
          style={{
            elevation: 0,
            backgroundColor: 'transparent',
            margin: '2%',
            maxHeight: 200,
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          <Card.Content>
            <VolunteerAvatar
              style={{
                alignContent: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              label={`${userData?.firstName?.charAt(
                0,
              )}${userData?.lastName?.charAt(0)}`}
              testID="profilePic"
              size="LARGE"
              source={{uri: profileURL}}
              isProfilePicture={true}
            />

            <TouchableOpacity
              testID="changeProfilePic"
              onPress={() => {
                console.log('CHANGE PROFILE PIC PRESSED');
                imagePicker();
              }}
              style={{
                marginTop: '-15%',
                marginRight: '5%',
                marginBottom: '10%',
                height: 50,
                width: 50,
                alignSelf: 'flex-end',
              }}>
              <Image
                style={{height: '100%', width: '100%', overflow: 'visible'}}
                source={Edit_Icon}
              />
            </TouchableOpacity>
            <Title style={{alignSelf: 'center'}} testID="firestoreName">
              {userData?.firstName}{' '}
            </Title>
          </Card.Content>
        </Card>

        {/* BIO CARD */}
        <Card style={{margin: '2%', maxHeight: '99%'}}>
          <Card.Content
            style={{
              margin: '2%',
            }}>
            <Subheading>Bio</Subheading>

            {editBio ? (
              <TextInput
                mode="outlined"
                testID="editBio"
                onChangeText={(updatedBio) => {
                  setBio(updatedBio);
                }}
                autoFocus={true}
                defaultValue={userData?.bio}
              />
            ) : (
              <Paragraph testID="bio">{bio}</Paragraph>
            )}
            <TouchableOpacity
              testID="editBioButton"
              onPress={() => {
                console.log('EDIT BIO PRESSED');

                setEditBio((editBio) => !editBio);
                if (editBio) {
                  updateOwnBio(bio, uid);
                }
              }}
              style={{
                height: 50,
                width: 50,
                alignSelf: 'flex-end',
              }}>
              <Image
                style={{height: '100%', width: '100%', overflow: 'visible'}}
                source={Edit_Icon}
              />
            </TouchableOpacity>
          </Card.Content>
          {/* Contact number card */}
        </Card>
        <Card
          style={{
            padding: '2%',
            margin: '2%',
          }}>
          <Card.Content>
            <Subheading>Contact number</Subheading>
            {editContactNumber ? (
              <TextInput
                keyboardType="number-pad"
                mode="outlined"
                testID="editContactNumber"
                onChangeText={(updatedNumber) => {
                  setContactNumber(updatedNumber);
                }}
                autoFocus={true}
                defaultValue={contactNumber}
                style={{}}
              />
            ) : (
              <Paragraph testID="bio">{contactNumber}</Paragraph>
            )}
            <TouchableOpacity
              testID="editContactNumber"
              onPress={() => {
                setEditContactNumber((editContactNumber) => !editContactNumber);
                if (editContactNumber) {
                  updateOwnContactNumber(contactNumber, uid);
                }
              }}
              style={{
                height: 50,
                width: 50,
                alignSelf: 'flex-end',
              }}>
              <Image
                style={{height: '100%', width: '100%', overflow: 'visible'}}
                source={Edit_Icon}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={{margin: '2%'}}>
          <Card.Content>
            <TrainingAccordionMenu training={userData?.training} />

            <SessionListAccordionMenu
              sessions={
                userData?.roles?.includes('NationalAdmin')
                  ? upcomingSessions
                  : myUpcomingSessions
              }
              route={route}
              navigation={navigation}
              title={'Upcoming Sessions'}
            />

            <SessionListAccordionMenu
              sessions={
                userData?.roles?.includes('NationalAdmin')
                  ? pastSessions
                  : myPastSessions
              }
              route={route}
              navigation={navigation}
              title={'Past Sessions'}
            />
          </Card.Content>
        </Card>
        <Card style={{margin: '2%', marginBottom: '10%'}}>
          <Card.Actions style={{justifyContent: 'space-around'}}>
            <CloseButton
              testID="signOutButton"
              onPress={() => {
                signOut().then(() => {
                  dispatch(updateRoleSpecificSessions([]));
                  dispatch(updateSessions([]));
                  dispatch(updateFirestoreUserData({}));
                });
              }}
              title="Signout"
            />

            <ConfirmButton
              title="Change Password"
              onPress={() => {
                togglePasswordChangeModal();
              }}></ConfirmButton>
          </Card.Actions>
        </Card>

        <Portal>
          <Modal
            visible={changePasswordModalVisible}
            onDismiss={togglePasswordChangeModal}>
            <Card>
              <Card.Title title="Change Password" />

              <Card.Content>
                <ResetPassword authenticatedUser={currentAuthenticatedUser} />
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
}
