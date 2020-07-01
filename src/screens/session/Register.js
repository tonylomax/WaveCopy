import React from 'react';
import {View, Text} from 'react-native';
import Moment from 'react-moment';
import {RegisterTabs} from 'components';

export default function Register({navigation, route}) {
  const {Type, Beach, DateTime, Attendees} = route.params;
  return (
    <View>
      <Text>Register</Text>
      <Text>
        {Type} - {Beach}
      </Text>
      <Moment element={Text} format="DD.MM.YY">
        {DateTime}
      </Moment>
      <RegisterTabs></RegisterTabs>
    </View>
  );
}
