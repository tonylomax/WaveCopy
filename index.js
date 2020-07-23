/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider as ReduxProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import store from './src/redux/store';
import React from 'react';
import messaging from '@react-native-firebase/messaging';

console.disableYellowBox = false;

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

const HeadlessCheck = ({isHeadless}) => {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
};

const AppWithReduxProvider = () => (
  <ReduxProvider store={store}>
    <PaperProvider>
      <HeadlessCheck />
    </PaperProvider>
  </ReduxProvider>
);

AppRegistry.registerComponent(appName, () => AppWithReduxProvider);
