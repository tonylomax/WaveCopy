import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {ConfirmButton} from 'components';
import {signOut} from 'utils';
export default function Profile({navigation}) {
  return (
    <SafeAreaView>
      <View>
        <ConfirmButton
          onPress={() => {
            signOut();
          }}
          title="signout"></ConfirmButton>
        <Text testID="bio'">Profile</Text>
      </View>
    </SafeAreaView>
  );
}
