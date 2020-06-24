import React, {useState} from 'react';
import {View, Text, TextInput, Button, Image} from 'react-native';
import {FONTS, COLOURS, TYOPGRAPHY} from 'styles';
import {loginWithEmail} from 'utils';
import {useSafeArea} from 'react-native-safe-area-context';

export default function Home({navigation, setLoggedIn}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

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
      <TextInput
        autoCapitalize="none"
        testID="email"
        onChangeText={(inputEmail) => setEmail(inputEmail)}
      />
      <Text>Password</Text>
      <TextInput
        autoCapitalize="none"
        testID="password"
        onChangeText={(inputPassword) => {
          setPassword(inputPassword);
        }}
      />
      <Button
        title="Log In"
        testID="submit-login-details"
        onPress={() => loginWithEmail(email, password)}
      />
    </View>
  );
}
