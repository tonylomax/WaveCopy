import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';

export default function Home({navigation, setLoggedIn}) {
  return (
    <View>
      <Text>The Wave Project</Text>
      <Text>...coming soon!</Text>
      <Text>Email</Text>
      <TextInput testID="email" />
      <Text>Password</Text>
      <TextInput testID="password" />
      <Button
        title="Log In"
        testID="submit-login-details"
        onPress={() => setLoggedIn(true)}
      />
    </View>
  );
}
