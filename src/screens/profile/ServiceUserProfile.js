import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import {Title, Paragraph, Surface, Subheading} from 'react-native-paper';
import {CallPerson, SurferAvatar} from 'components';
import {coverWave} from '../../assets/';

export default function ServiceUserProfile({route}) {
  const {serviceUser, roles} = route.params;

  console.log('serviceUser in serviceuser profile', serviceUser);

  return (
    <SafeAreaView>
      <ImageBackground style={{height: 175, width: '100%'}} source={coverWave}>
        {/* Edit session button */}
      </ImageBackground>
      <SurferAvatar
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
        <TouchableOpacity
          onPress={async () => {
            await Linking.openURL(`tel:${serviceUser?.number}`).catch((err) => {
              console.log(err);
            });
          }}>
          <Paragraph>
            {serviceUser?.number ? serviceUser?.number : 'No number'}
          </Paragraph>
        </TouchableOpacity>

        <CallPerson
          onPress={async () => {
            await Linking.openURL(`tel:${serviceUser?.number}`).catch((err) => {
              console.log(err);
            });
          }}
          title="Call Parent"></CallPerson>
      </View>
    </SafeAreaView>
  );
}
