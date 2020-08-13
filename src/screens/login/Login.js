import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Avatar,
  Title,
  TextInput,
  Paragraph,
  Portal,
  Modal,
  Card,
  ProgressBar,
  Subheading,
  Caption,
  useTheme,
} from 'react-native-paper';

import {FONTS, COLOURS, TYOPGRAPHY} from 'styles';
import {loginWithEmail} from 'utils';
import Svg, {Path} from 'react-native-svg';

import {serializeError} from 'serialize-error';
import {
  ConfirmButton,
  LoadingScreen,
  ResetPassword,
  CloseButton,
} from 'components';
import {LogoSquareWhiteNamed} from 'assets';

export default function Home({navigation, setLoggedIn}) {
  const {buttonTopMargin} = useTheme();

  //LOCAL STATE
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(
    false,
  );
  //LOCAL STATE
  const togglePasswordResetModal = () =>
    setResetPasswordModalVisible(
      (resetPasswordModalVisible) => !resetPasswordModalVisible,
    );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLOURS.DEEP_BLUE}}>
      <LoadingScreen visible={loading} isSpinning={true} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={320}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View>
          <View
            style={{
              alignItems: 'center',
              marginTop: '5%',
              height: '45%',
            }}>
            <LogoSquareWhiteNamed />
          </View>

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

          <Card
            style={{
              backgroundColor: COLOURS.DEEP_BLUE,
              marginTop: '2%',
              marginBottom: '10%',
              alignContent: 'center',
            }}>
            <Card.Actions
              style={{
                width: '90%',
                paddingRight: '5%',
                paddingLeft: '5%',
                alignSelf: 'center',
                justifyContent: 'space-around',
              }}>
              <ConfirmButton
                title="Log In"
                testID="submit-login-details"
                disabled={email === undefined || password === undefined}
                onPress={() => {
                  setLoading(true);
                  loginWithEmail(email, password, setLoggedIn).then(
                    (result) => {
                      const serializedResult = serializeError(result);
                      console.log('message', serializedResult.message);
                      if (serializedResult.code) {
                        setLoading(false);
                        setTimeout(() => {
                          Alert.alert('Error', serializedResult.message);
                        }, 200);
                      } else setLoggedIn(true);
                    },
                  );
                }}
              />
              <CloseButton
                title="Reset Password"
                onPress={() => {
                  togglePasswordResetModal();
                }}></CloseButton>
            </Card.Actions>
          </Card>

          <Portal>
            <Modal
              visible={resetPasswordModalVisible}
              onDismiss={togglePasswordResetModal}>
              <Card>
                <Card.Title title="Request Password Reset" />
                <Card.Content>
                  <ResetPassword
                    mode={'reset'}
                    dismiss={togglePasswordResetModal}
                  />
                </Card.Content>
              </Card>
            </Modal>
          </Portal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
