import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SessionDetails from './SessionDetails';
import AddServiceUsers from './AddServiceUsers';
import ConfirmSession from './ConfirmSession';
const Stack = createStackNavigator();

export default function EditSession({route}) {
  const {params} = route;
  useEffect(() => {
    console.log(params);
  }, []);
  console.log('came into edit session', route.name);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SessionDetails"
        component={SessionDetails}
        options={{title: 'Session details'}}
        initialParams={params}
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
