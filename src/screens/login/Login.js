import React, {useState, useEffect} from 'react';
import {View, Text, Button, Image, Alert, SafeAreaView} from 'react-native';
import {TextInput} from 'react-native-paper';
import {FONTS, COLOURS, TYOPGRAPHY} from 'styles';
import {loginWithEmail} from 'utils';
import {useDispatch} from 'react-redux';
import {serializeError} from 'serialize-error';

export default function Home({navigation, setLoggedIn}) {
  const dispatch = useDispatch();

  //LOCAL STATE
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  //LOCAL STATE

  return (
    <SafeAreaView>
      <View>
        <Image
          source={require('../../assets/images/logos/Logo_Square_Blue_Unnamed.png')}
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
          secureTextEntry={true}
          autoCapitalize="none"
          testID="password"
          onChangeText={(inputPassword) => {
            setPassword(inputPassword);
          }}
        />
        <Button
          title="Log In"
          testID="submit-login-details"
          onPress={() => {
            loginWithEmail(email, password, setLoggedIn).then((result) => {
              const serializedResult = serializeError(result);
              console.log('message', serializedResult.message);
              if (serializedResult.code) {
                Alert.alert(serializedResult.message);
              } else setLoggedIn(true);
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
}
