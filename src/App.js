import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import Home from './screens/home/Home';
import Login from './screens/login/Login';
import Profile from './screens/profile/Profile';
import CreateSession from './screens/createSession/CreateSession';
import {
  createFirebaseAuthSubscription,
  subscribeToFirestoreUserData,
} from './redux/index';
import {useDispatch, useSelector} from 'react-redux';
import {isEmpty} from 'lodash';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const BottomTabs = createBottomTabNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <BottomTabs.Navigator>
        <BottomTabs.Screen
          name="Home"
          component={Home}
          options={{tabBarTestID: 'navigate-to-home-button'}}
        />
        <BottomTabs.Screen
          name="Create Session"
          component={CreateSession}
          options={{tabBarTestID: 'navigate-to-create-session'}}
        />
        <BottomTabs.Screen
          name="Profile"
          component={Profile}
          options={{tabBarTestID: 'navigate-to-profile-button'}}
        />
      </BottomTabs.Navigator>
    </NavigationContainer>
  );
};

const App: () => React$Node = () => {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);

  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );

  useEffect(() => {
    const unsubscribeFromFirebaseAuth = dispatch(
      createFirebaseAuthSubscription(),
    );

    return () => {
      unsubscribeFromFirebaseAuth();
    };
  }, []);

  useEffect(() => {
    console.log('currentAuthenticatedUser is ', currentAuthenticatedUser);

    if (!isEmpty(currentAuthenticatedUser)) {
      const unsubscribeFromFirestoreUserData = dispatch(
        subscribeToFirestoreUserData(currentAuthenticatedUser.uid),
      );
      // return () => unsubscribeFromFirestoreUserData();
    }
  }, [currentAuthenticatedUser]);

  return isEmpty(currentAuthenticatedUser) ? (
    <Login setLoggedIn={setLoggedIn} />
  ) : (
    <Navigator />
  );
};

export default App;
