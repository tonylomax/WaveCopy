import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {ConfirmButton} from 'components';
import {signOut} from 'utils';
import {useSelector, useDispatch} from 'react-redux';

export default function Profile({navigation}) {
  const userData = useSelector((state) => state.firestoreReducer.userData);
  return (
    <SafeAreaView>
      <View>
        <ConfirmButton
          onPress={() => {
            signOut();
          }}
          title="signout"></ConfirmButton>
        <Text testID="bio'">PROFILE</Text>
        <Text>Name: {userData.Name} </Text>
      </View>
    </SafeAreaView>
  );
}
