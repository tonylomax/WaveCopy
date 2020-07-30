import React, {useEffect, useState} from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';

import Moment from 'react-moment';
import moment from 'moment';
import {TrainingAccordionMenu, SessionListAccordionMenu} from 'components';
import 'moment/src/locale/en-gb';
import {
  Title,
  Paragraph,
  Surface,
  Subheading,
  Avatar,
} from 'react-native-paper';
import {VolunteerAvatar} from 'components';
import {coverWave} from '../../assets/';
import {getImageDownloadURI, retrieveRegions} from 'utils';

moment.locale('en-gb');
moment().format('en-gb');

export default function WaveTeamProfile({route, navigation}) {
  const {mentor} = route.params;
  const {roles} = useSelector((state) => state.authenticationReducer.roles);

  const regions = useSelector((state) => state.firestoreReducer.regions);
  const beaches = useSelector((state) => state.firestoreReducer.beaches);
  const IS_ADMIN = roles.includes('NationalAdmin');
  const [profileURL, setProfileURL] = useState();
  const sessionData = IS_ADMIN ? 'sessionData' : 'roleSpecificSessionData';
  // Find sessions that a volunteer is signed up for
  // const volunteerSessions = useSelector((state) =>
  //   state.firestoreReducer[sessionData].filter((session) => {
  //     console.log('firestore reducer in volunteer sessions', {session});
  //     return session?.mentors?.some(
  //       (filteredMentor) => filteredMentor.id === mentor.id,
  //     );
  //   }),
  // );
  const allSessions = useSelector(
    (state) => state.firestoreReducer.sessionData,
  );
  useEffect(() => {
    console.log({allSessions});
    console.log({mentor});

    if (mentor?.id) {
      getImageDownloadURI(mentor.id).then((url) => {
        setProfileURL(url);
      });
      console.log({regions});
      console.log('region id', mentor.region);
      if (regions && regions?.length > 0) {
        const userRegion = regions.find(
          (region) => region.id === mentor.region,
        );
        console.log({userRegion});
        setRegion(userRegion?.name);
      }
    }

    return () => {};
  }, [mentor]);

  useEffect(() => {
    if (!regions || regions.length === 0) {
      retrieveRegions();
    }
  }, [regions]);

  const [region, setRegion] = useState('');

  return (
    <View>
      {/* Place holder for profile pic */}
      <ImageBackground
        style={{height: 175, width: '100%'}}
        source={coverWave}></ImageBackground>
      <VolunteerAvatar
        source={{
          uri: profileURL,
        }}
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
        <Paragraph>
          {mentor.contactNumber ? mentor.contactNumber : 'No contact number'}{' '}
        </Paragraph>
        <Subheading>Volunteering area</Subheading>
        <Paragraph>{region ? region : 'Unknown Region'}</Paragraph>
      </View>

      <TrainingAccordionMenu training={mentor.training}></TrainingAccordionMenu>
      <SessionListAccordionMenu
        sessions={allSessions}
        // beaches={beaches}
        navigation={navigation}
        route={route}
        title={'Sessions'}></SessionListAccordionMenu>
    </View>
  );
}

//   return (
//     <SafeAreaView>

//       <View
//         style={{
//           paddingTop: '20%',
//           display: 'flex',
//           alignItems: 'center',
//           justifyItems: 'center',
//         }}>
//         <Title>
//           {serviceUser?.firstName} {serviceUser?.lastName}{' '}
//           {serviceUser?.age && `, ${serviceUser.age}`}
//         </Title>
//         <Subheading>Reason for referral </Subheading>

//         <Subheading>Triggers </Subheading>

//         <Subheading>Reactions </Subheading>

//         <Subheading>Medical requirements </Subheading>

//         <Subheading>Emergency contacts</Subheading>
//         <TouchableOpacity
//           onPress={async () => {
//             await Linking.openURL(`tel:${serviceUser?.number}`).catch((err) => {
//               console.log(err);
//             });
//           }}>
//           <Paragraph>
//             {serviceUser?.number ? serviceUser?.number : 'No number'}
//           </Paragraph>
//         </TouchableOpacity>

//         <CallPerson
//           disabled={serviceUser?.number ? false : true}
//           onPress={async () => {
//             await Linking.openURL(`tel:${serviceUser?.number}`).catch((err) => {
//               console.log(err);
//             });
//           }}
//           title="Call Parent"></CallPerson>
//       </View>
//     </SafeAreaView>
//   );
// }
