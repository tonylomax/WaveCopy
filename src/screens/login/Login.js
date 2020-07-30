import React, {useState, useEffect} from 'react';
import {View, Text, Button, Image, Alert, SafeAreaView} from 'react-native';
import {TextInput, Caption, Headline} from 'react-native-paper';
import {FONTS, COLOURS, TYOPGRAPHY} from 'styles';
import {loginWithEmail} from 'utils';
import {useDispatch} from 'react-redux';
import {serializeError} from 'serialize-error';
import {ConfirmButton, LoadingScreen} from './../../components';

export default function Home({navigation, setLoggedIn}) {
  const dispatch = useDispatch();

  //LOCAL STATE
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  //LOCAL STATE

  return (
    <SafeAreaView>
      <LoadingScreen visible={loading} />

      <View>
        <Image
          source={require('../../assets/images/logos/Logo_Square_Blue_Unnamed.png')}
        />
        <Headline>The Wave Project</Headline>

        <Caption>Email</Caption>
        <TextInput
          autoCapitalize="none"
          testID="email"
          onChangeText={(inputEmail) => setEmail(inputEmail)}
        />
        <Caption>Password</Caption>
        <TextInput
          secureTextEntry={true}
          autoCapitalize="none"
          testID="password"
          onChangeText={(inputPassword) => {
            setPassword(inputPassword);
          }}
        />
        <ConfirmButton
          title="Log In"
          testID="submit-login-details"
          onPress={() => {
            setLoading(true);
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
