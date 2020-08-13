import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';
moment.locale('en-gb');
moment().format('en-gb');
import {
  TrainingAccordionMenu,
  SessionListAccordionMenu,
  VolunteerAvatar,
} from 'components';
import 'moment/src/locale/en-gb';
import {Title, Paragraph, Subheading} from 'react-native-paper';
import {ConfirmButton, CallPerson} from 'components';
import {coverWave} from '../../assets/';
import {simplyGetImageDownloadURI, retrieveRegions} from 'utils';

export default function WaveTeamProfile({route, navigation}) {
  const mentorID = route.params;

  const [region, setRegion] = useState('');
  const [profileURL, setProfileURL] = useState();
  const roles = useSelector((state) => state.firestoreReducer.userData.roles);

  const regions = useSelector((state) => state?.firestoreReducer?.regions);
  const beaches = useSelector((state) => state?.firestoreReducer?.beaches);
  // Find sessions that a volunteer is signed up for
  console.log('roles', roles);
  const IS_ADMIN = roles.includes('NationalAdmin');
  console.log('IS_ADMIN', IS_ADMIN);
  const sessionData = IS_ADMIN ? 'sessionData' : 'roleSpecificSessionData';

  const volunteerSessions = useSelector((state) => {
    console.log('inside use selector', state?.firestoreReducer.sessionData);
    return state?.firestoreReducer[sessionData]?.filter((session) => {
      console.log('firestore reducer in volunteer sessions', {session});
      return session?.mentors?.some(
        (filteredMentor) => filteredMentor.id === mentorID,
      );
    });
  });

  const mentor = useSelector((state) =>
    state.firestoreReducer.selectedSessionSubscribedMentors.find(
      (subscribedMentor) => {
        return mentorID === subscribedMentor.id;
      },
    ),
  );

  useEffect(() => {
    console.log('mentor changed');
    if (mentor?.id) {
      simplyGetImageDownloadURI(mentor.id)
        .then((url) => {
          console.log('url retrieved ,', url);
          setProfileURL(url);
        })
        .catch((err) => console.log(err));
      if (regions && regions?.length > 0) {
        const userRegion = regions.find(
          (region) => region.id === mentor.region,
        );
        setRegion(userRegion?.name);
      }
    }

    return () => {};
  }, [mentor]);

  useEffect(() => {
    if (!regions || regions?.length === 0) {
      retrieveRegions();
    }
  }, [regions]);

  return (
    <ScrollView bounces={false}>
      {/* Place holder for profile pic */}
      <ImageBackground
        style={{height: 175, width: '100%'}}
        source={coverWave}></ImageBackground>
      <VolunteerAvatar
        size="MEDIUM"
        label={`${mentor?.firstName.charAt(0)}${mentor?.lastName.charAt(0)}`}
        isProfilePicture={true}
        source={{uri: profileURL}}
      />
      {/* Mentor name and age */}
      <View
        style={{
          paddingTop: '20%',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
        }}>
        <Title>
          {mentor.firstName} {mentor.lastName}
          {mentor.dateOfBirth && ', '}
          {mentor.dateOfBirth && moment().diff(mentor.dateOfBirth, 'years')}
        </Title>

        <CallPerson
          title={
            mentor.contactNumber ? mentor.contactNumber : 'No contact number'
          }
          icon="phone"
          disabled={mentor.contactNumber ? false : true}
          onPress={async () => {
            await Linking.openURL(`tel:${mentor?.contactNumber}`).catch(
              (err) => {
                console.log(err);
              },
            );
          }}></CallPerson>

        <Subheading>Volunteering area</Subheading>
        <Paragraph>{region ? region : 'Unknown Region'}</Paragraph>
      </View>

      <TrainingAccordionMenu training={mentor.training}></TrainingAccordionMenu>
      <SessionListAccordionMenu
        sessions={volunteerSessions}
        beaches={beaches}
        navigation={navigation}
        route={route}
        title={'Sessions'}></SessionListAccordionMenu>
    </ScrollView>
  );
}
