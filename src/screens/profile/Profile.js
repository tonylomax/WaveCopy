import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {ConfirmButton, ImageConfirmPopup} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {Edit_Icon, BrightonBeach} from 'assets';
import ImagePicker from 'react-native-image-picker';
import {
  uploadFile,
  monitorFileUpload,
  updateOwnBio,
  getImageDownloadURI,
  signOut,
  updateOwnContactNumber,
} from 'utils';
import ProgressBar from 'react-native-progress/Bar';
import {ResetPassword} from 'components';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function Profile({navigation}) {
  //REDUX STATE
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );
  //REDUX STATE

  const sessions = useSelector((state) => state.firestoreReducer.sessionData);
  const mySessions = useSelector((state) => {
    return state.firestoreReducer.roleSpecificSessionData.filter((session) => {
      let filteredMentors = session?.Mentors.filter((mentor) => {
        console.log(mentor.id === UID);
        return mentor.id === UID;
      });
      if (filteredMentors.length >= 1) {
        return true;
      }
    });
  });

  const beaches = useSelector((state) => state.firestoreReducer.beaches);

  //LOCAL STATE
  const [bio, setBio] = useState(userData?.Bio);
  const [contactNumber, setContactNumber] = useState(userData?.ContactNumber);
  const [profileURL, setProfileURL] = useState();
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
  //LOCAL STATE

  const getFileLocalPath = (response) => {
    const {path, uri} = response;
    return Platform.OS === 'android' ? path : uri;
  };

  useEffect(() => {
    console.log('USER DATA IN PROFILE', userData);
  }, [userData]);

  useEffect(() => {
    console.log('SESSIONS IN PROFILE', sessions);
  }, [sessions]);

  useEffect(() => {
    getImageDownloadURI(UID).then((url) => {
      setProfileURL(url);
    });
  }, [newProfilePicUploadComplete]);
  const getBeach = (beachID) => beaches.filter((beach) => (beach.id = beachID));

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
    <SafeAreaView style={{flex: 1}}>
      <ScrollView testID="profile-scroll-view">
        <View style={{flex: 1}}>
          <Image
            style={{alignSelf: 'center', height: 150}}
            source={BrightonBeach}
          />

          <ImageConfirmPopup
            visible={imageConfirmPopup}
            setVisible={setImageConfirmPopup}
            imgSource={uploadImg?.uri}
            yesAction={() => {
              const task = uploadFile(localFilePath, UID);
              monitorFileUpload(
                task,
                setuploadProgress,
                newProfilePicUploadComplete,
                setNewProfilePicUploadComplete,
              );
            }}></ImageConfirmPopup>

          <ConfirmButton
            testID="signOutButton"
            onPress={() => {
              signOut();
            }}
            title="signout"></ConfirmButton>
          <Image
            title="Profle Pic"
            testID="profilePic"
            style={{height: '10%', width: '10%'}}
            source={{
              uri: profileURL,
            }}></Image>

          {editBio ? (
            <TextInput
              testID="editBio"
              onChangeText={(updatedBio) => {
                setBio(updatedBio);
              }}
              autoFocus={true}
              defaultValue={userData?.Bio}></TextInput>
          ) : (
            <Text testID="bio">Bio: {bio}</Text>
          )}

          <TouchableOpacity
            testID="editBioButton"
            onPress={() => {
              setEditBio((editBio) => !editBio);
            }}
            style={{height: '15%', width: '15%'}}>
            <Image
              style={{height: '75%', width: '75%'}}
              source={Edit_Icon}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setEditContactNumber((editContactNumber) => !editContactNumber);
            }}>
            {editContactNumber ? (
              <TextInput
                onChangeText={(updatedNumber) => {
                  setContactNumber(updatedNumber);
                }}
                autoFocus={true}
                defaultValue={contactNumber}>
                {' '}
              </TextInput>
            ) : (
              <Text>{contactNumber}</Text>
            )}
          </TouchableOpacity>

          <ConfirmButton
            title="Update contact number"
            onPress={() => {
              setEditContactNumber(false);
              updateOwnContactNumber(contactNumber, UID);
            }}></ConfirmButton>

          <Text> Training</Text>
          {userData?.Training?.map((indvidualTraining, index) => (
            <View key={index}>
              <Text>{indvidualTraining?.Name} </Text>
              <Text>
                Completed:{' '}
                <Moment element={Text} format="MMMM YYYY">
                  {indvidualTraining}
                </Moment>
              </Text>
            </View>
          ))}

          <Text> My Sessions</Text>
          <FlatList
            testID="profileSessionsList"
            data={
              userData?.Roles?.includes('NationalAdmin') ? sessions : mySessions
            }
            renderItem={({item}) => (
              <TouchableHighlight
                testID={`ProfileSessionsListItem${item.ID}`}
                disabled={moment(item?.DateTime).diff(new Date()) < 0}
                onPress={() => {
                  const selectedBeach = getBeach(item.ID)[0];
                  console.log({item});
                  navigation.navigate('ProfileSession', {
                    item,
                    selectedBeach,
                  });
                }}
                style={{
                  borderColor:
                    moment(item?.DateTime).diff(new Date()) < 0
                      ? 'grey'
                      : 'black',
                  backgroundColor:
                    moment(item?.DateTime).diff(new Date()) < 0 ? 'grey' : '',
                  borderWidth: 2,
                  marginBottom: '2%',
                }}>
                <View
                  // testID={`ProfileSessionsListItem${item.ID}`}
                  id={item.ID}>
                  <Text> {item?.Type} </Text>
                  <Text> {item?.Beach} </Text>
                  <Text> {item?.DateTime} </Text>
                  <Text>
                    Volunteers: {item?.Mentors?.length}/{item?.MaxMentors}
                  </Text>
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={(item) => item.ID}></FlatList>

          <ConfirmButton
            testID="confirmBioUpdate"
            onPress={() => {
              setEditBio(false);
              updateOwnBio(bio, UID);
            }}
            title="Confirm Bio Update"></ConfirmButton>
          <Text testID="firestoreName">Name: {userData?.firstName} </Text>

          <ConfirmButton
            testID="uploadNewProfilePic"
            title="Upload image"
            onPress={() => {
              imagePicker();
            }}
          />
          <ProgressBar progress={uploadProgress} width={200} />

          <ResetPassword
            authenticatedUser={currentAuthenticatedUser}></ResetPassword>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
