import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import SessionDetails from './SessionDetails';
import AddServiceUsers from './AddServiceUsers';
import ConfirmSession from './ConfirmSession';
const Stack = createStackNavigator();

export default function CreateSession() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SessionDetails"
        component={SessionDetails}
        options={{title: 'Session details'}}
      />
      <Stack.Screen
        name="AddServiceUsers"
        component={AddServiceUsers}
        options={{title: 'Add service users'}}
      />
      <Stack.Screen
        name="ConfirmSession"
        component={ConfirmSession}
        options={{title: 'EDIT PAGE'}}
      />
    </Stack.Navigator>
  );
}
