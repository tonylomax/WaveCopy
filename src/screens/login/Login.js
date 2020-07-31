import React, {useState, useEffect} from 'react';
import {View, Text, Button, Image, Alert, SafeAreaView} from 'react-native';
import {TextInput, Caption, useTheme} from 'react-native-paper';
import {FONTS, COLOURS, TYOPGRAPHY} from 'styles';
import {loginWithEmail} from 'utils';

import {serializeError} from 'serialize-error';
import {ConfirmButton} from './../../components';
import {Logo_Square_White_Named} from 'assets';

export default function Home({navigation, setLoggedIn}) {
  const {buttonTopMargin} = useTheme();

  //LOCAL STATE
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  //LOCAL STATE

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLOURS.DEEP_BLUE}}>
      <View>
        <Image
          style={{
            alignSelf: 'center',
            tintColor: 'white',
            marginTop: 70,
          }}
          source={Logo_Square_White_Named}
        />

        <Caption>Email</Caption>
        <TextInput
          mode="outlined"
          style={{maxWidth: '90%', minWidth: '90%', alignSelf: 'center'}}
          placeholder="Email"
          autoCapitalize="none"
          testID="email"
          onChangeText={(inputEmail) => setEmail(inputEmail)}
        />
        <Caption>Password</Caption>
        <TextInput
          mode="outlined"
          style={{
            maxWidth: '90%',
            minWidth: '90%',
            alignSelf: 'center',
          }}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          testID="password"
          onChangeText={(inputPassword) => {
            setPassword(inputPassword);
          }}
        />
        <ConfirmButton
          style={{marginTop: 50}}
          title="Log In"
          testID="submit-login-details"
          onPress={() => {
            console.log('PRESSED');
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
