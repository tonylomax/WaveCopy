import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Home from './screens/home/Home';
import Login from './screens/login/Login';
import Profile from './screens/profile/Profile';
import CreateSession from './screens/createSession/CreateSession';
import Session from './screens/session/Session';
import Register from './screens/session/Register';
import {subscribeToFirestoreUsers, createAuthSubscription} from 'utils';
import {useSelector} from 'react-redux';
import {isEmpty} from 'lodash';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const BottomTabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const TabNavigator = () => (
  <NavigationContainer>
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="Home"
        component={HomeNavigator}
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

const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={Home}></HomeStack.Screen>
    <HomeStack.Screen name="Session" component={Session}></HomeStack.Screen>
    <HomeStack.Screen name="Register" component={Register}></HomeStack.Screen>
  </HomeStack.Navigator>
);

const App: () => React$Node = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );

  useEffect(() => {
    const unsubscribeFromFirebaseAuth = createAuthSubscription();
    return () => {
      unsubscribeFromFirebaseAuth();
    };
  }, []);

  useEffect(() => {
    console.log(
      'currentAuthenticatedUser is ',
      currentAuthenticatedUser?.email,
    );

    if (!isEmpty(currentAuthenticatedUser)) {
      const unsubscribeFromFirestoreUserData = subscribeToFirestoreUsers(
        currentAuthenticatedUser.uid,
      );
      return () => unsubscribeFromFirestoreUserData();
    }
  }, [currentAuthenticatedUser]);

  return isEmpty(currentAuthenticatedUser) ? (
    <Login setLoggedIn={setLoggedIn} />
  ) : (
    <TabNavigator />
  );
};

export default App;
