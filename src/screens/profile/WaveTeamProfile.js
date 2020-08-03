import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';
moment.locale('en-gb');
moment().format('en-gb');
import {TrainingAccordionMenu, SessionListAccordionMenu} from 'components';
import 'moment/src/locale/en-gb';
import {Title, Paragraph, Subheading} from 'react-native-paper';
import {ConfirmButton} from 'components';
import VolunteerOtherAvatar from '../../components/VolunteerOtherAvatar';
import {coverWave} from '../../assets/';
import {simplyGetImageDownloadURI, retrieveRegions} from 'utils';

export default function WaveTeamProfile({route, navigation}) {
  const {mentor} = route.params;
  const [region, setRegion] = useState('');
  const [profileURL, setProfileURL] = useState();
  const {roles} = useSelector((state) => state?.authenticationReducer?.roles);
  const regions = useSelector((state) => state?.firestoreReducer?.regions);
  const beaches = useSelector((state) => state?.firestoreReducer?.beaches);
  // Find sessions that a volunteer is signed up for
  const volunteerSessions = useSelector((state) =>
    state?.firestoreReducer[sessionData]?.filter((session) => {
      console.log('firestore reducer in volunteer sessions', {session});
      return session?.mentors?.some(
        (filteredMentor) => filteredMentor.id === mentor.id,
      );
    }),
  );
  const IS_ADMIN = roles.includes('NationalAdmin');
  const sessionData = IS_ADMIN ? 'sessionData' : 'roleSpecificSessionData';
  // const allSessions = useSelector(
  //   (state) => state.firestoreReducer.sessionData,
  // );
  useEffect(() => {
    console.log('mento changed');
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
      <Paragraph>profileURL</Paragraph>
      <VolunteerOtherAvatar
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
          {moment().diff(mentor.dateOfBirth, 'years') > 0 && ', '}
          {moment().diff(mentor.dateOfBirth, 'years') > 0 &&
            moment().diff(mentor.dateOfBirth, 'years')}
        </Title>
        <ConfirmButton
          title={
            mentor.contactNumber ? mentor.contactNumber : 'No contact number'
          }
          icon="phone"
          disabled={mentor.contactNumber ? false : true}></ConfirmButton>

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
