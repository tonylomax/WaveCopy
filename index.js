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

console.disableYellowBox = true;

const AppWithReduxProvider = () => (
  <ReduxProvider store={store}>
    <PaperProvider>
      <App />
    </PaperProvider>
  </ReduxProvider>
);

AppRegistry.registerComponent(appName, () => AppWithReduxProvider);
