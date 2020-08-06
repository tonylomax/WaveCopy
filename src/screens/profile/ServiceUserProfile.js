import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Linking,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  Title,
  Paragraph,
  Surface,
  Subheading,
  TouchableRipple,
} from 'react-native-paper';
import {CallPerson, SurferAvatar} from 'components';
import {coverWave} from '../../assets/';

export default function ServiceUserProfile({route}) {
  const {serviceUser, roles} = route.params;

  console.log('serviceUser in serviceuser profile', serviceUser);

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
        <Subheading>Reason for referral </Subheading>

        <Subheading>Triggers </Subheading>

        <Subheading>Reactions </Subheading>

        <Subheading>Medical requirements </Subheading>

        <Subheading>Emergency contacts</Subheading>
        <TouchableRipple
          onPress={async () => {
            await Linking.openURL(`tel:${serviceUser?.contactNumber}`).catch(
              (err) => {
                console.log(err);
              },
            );
          }}>
          <Paragraph>
            {serviceUser?.contactNumber
              ? serviceUser?.contactNumber
              : 'No number'}
          </Paragraph>
        </TouchableRipple>

        <CallPerson
          disabled={serviceUser?.contactNumber ? false : true}
          onPress={async () => {
            await Linking.openURL(`tel:${serviceUser?.number}`).catch((err) => {
              console.log(err);
            });
          }}
          title="Call Parent"></CallPerson>
      </View>
    </ScrollView>
  );
}
