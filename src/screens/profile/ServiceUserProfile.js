import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {CallPerson} from 'components';

export default function ServiceUserProfile({route}) {
  const {serviceUser, roles} = route.params;

  console.log('serviceUser in serviceuser profile', serviceUser);

  return (
    <View>
      <Text>
        {serviceUser?.firstName} {serviceUser?.lastName}
      </Text>
      <Text>Age:</Text>
      <Text>Reason for referral: </Text>
      <Text>Triggers: </Text>
      <Text>Reactions </Text>
      <Text>Medical requirements </Text>
      <TouchableOpacity
        onPress={async () => {
          await Linking.openURL(`tel:${serviceUser?.number}`).catch((err) => {
            console.log(err);
          });
        }}>
        <Text>Emergency contacts: {serviceUser?.number} </Text>
      </TouchableOpacity>

      <CallPerson title="Call Parent"></CallPerson>
    </View>
  );
}
