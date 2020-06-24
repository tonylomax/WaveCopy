import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import SessionDetails from './SessionDetails';
import AddServiceUsers from './AddServiceUsers';
const Stack = createStackNavigator();

export default function CreateSession() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SessionDetails" component={SessionDetails} />
      <Stack.Screen name="AddServiceUsers" component={AddServiceUsers} />
    </Stack.Navigator>
  );
}
