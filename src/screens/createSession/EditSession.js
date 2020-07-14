import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native';
import SessionDetails from './SessionDetails';
import AddServiceUsers from './AddServiceUsers';
import ConfirmSession from './ConfirmSession';
import {HeaderBackButton} from 'react-navigation';

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
        // options={{
        //   title: 'Session details',
        // }}
        options={({navigation}) => ({
          title: 'Edit session in the screen',
          headerMode: 'screen',
          headerStyle: {backgroundColor: 'blue'},
          headerLeft: () => (
            <Button onPress={() => navigation.goBack()} title="special Back" />
          ),
        })}
        initialParams={params}
      />
      <Stack.Screen
        name="AddServiceUsers"
        component={AddServiceUsers}
        navigationOptions
      />
      <Stack.Screen
        name="ConfirmSession"
        component={ConfirmSession}
        options={{title: 'EDIT PAGE'}}
      />
    </Stack.Navigator>
  );
}
