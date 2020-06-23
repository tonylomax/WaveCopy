import React from 'react';
import {View, Text, TextInput, Button, Image} from 'react-native';
import {FONTS, COLOURS, TYOPGRAPHY} from 'styles';

export default function Home({navigation, setLoggedIn}) {
  return (
    <View>
      <Image
        source={require('../assets/images/Logo_Square_Blue_Unnamed.png')}
      />
      <Text style={(FONTS.H1, {color: COLOURS.DEEP_BLUE})}>
        The Wave Project
      </Text>
      <Text style>...coming soon!</Text>
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
