import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Linking,
  ImageBackground,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  Title,
  Paragraph,
  Surface,
  Subheading,
  TouchableRipple,
  Chip,
  Card,
} from 'react-native-paper';
import {CallPerson, SurferAvatar} from 'components';
import {coverWave} from '../../assets/';
import {useSelector} from 'react-redux';

export default function ServiceUserProfile({route}) {
  const serviceUserID = route.params;

  console.log('serviceUser in serviceuser profile', serviceUserID);

  const serviceUser = useSelector((state) =>
    state.firestoreReducer.selectedSessionSubscribedAttendees.find(
      (subscribedAttendee) => {
        return serviceUserID === subscribedAttendee.id;
      },
    ),
  );

  return (
    <ScrollView>
      <ImageBackground style={{height: 175, width: '100%'}} source={coverWave}>
        {/* Edit session button */}
      </ImageBackground>
      <SurferAvatar
        isProfilePicture={true}
        label={`${serviceUser?.firstName.charAt(
          0,
        )}${serviceUser?.lastName.charAt(0)}`}
      />
      <View
        style={{
          paddingTop: '20%',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
        }}>
        <Title>
          {serviceUser?.firstName} {serviceUser?.lastName}{' '}
          {serviceUser?.age && `, ${serviceUser.age}`}
        </Title>
        {/* <Subheading>Reason for referral </Subheading>

        <Subheading>Triggers </Subheading>

        <Subheading>Reactions </Subheading>

        <Subheading>Medical requirements </Subheading> */}
        {serviceUser?.about && serviceUser?.about !== '' && (
          <Subheading style={{margin: '2%'}}>About</Subheading>
        )}

        <Paragraph style={{margin: '2%'}}>{serviceUser?.about}</Paragraph>

        {serviceUser?.phoneNumbers?.length > 0 ? (
          <FlatList
            data={serviceUser?.phoneNumbers}
            renderItem={({item}) => {
              return (
                <CallPerson
                  style={{margin: '2%'}}
                  disabled={item ? false : true}
                  onPress={async () => {
                    await Linking.openURL(`tel:${item.number}`).catch((err) => {
                      console.log(err);
                    });
                  }}
                  title={`Emergency ${
                    item.type === null ? 'Number' : item.type
                  }`}></CallPerson>
              );
            }}
          />
        ) : (
          <Chip
            style={{
              alignSelf: 'center',
              marginBottom: '3%',
            }}
            mode="outlined"
            icon="information"
            onPress={() => console.log('Pressed')}>
            No emergency contacts
          </Chip>
        )}
      </View>
    </ScrollView>
  );
}
