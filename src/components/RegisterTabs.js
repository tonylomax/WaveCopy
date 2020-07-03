import React from 'react';
import {Text, View} from 'react-native';

export default function RegisterTabs({children, registerTitle}) {
  return (
    <View>
      <Text> {registerTitle} </Text>
      {children}
    </View>
  );
}
