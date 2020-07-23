import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Home from './screens/home/Home';
import Login from './screens/login/Login';
import Profile from './screens/profile/Profile';
import Session from './screens/session/Session';
import Register from './screens/session/Register';
import {
  subscribeToFirestoreUsers,
  createAuthSubscription,
  userHasPermission,
  addNotificationToken,
  requestNotificationPermission,
} from 'utils';
import {useSelector} from 'react-redux';
import {isEmpty} from 'lodash';
import store from './redux/store/index';
import {ROLES} from 'constants';
import WaveTeamProfile from './screens/profile/WaveTeamProfile';
import ServiceUserProfile from './screens/profile/ServiceUserProfile';
import SessionDetails from './screens/createSession/SessionDetails';
import AddServiceUsers from './screens/createSession/AddServiceUsers';
import ConfirmSession from './screens/createSession/ConfirmSession';
import {HeaderBackButton} from 'react-navigation';
import {CurvedTabBar} from 'components';
import messaging from '@react-native-firebase/messaging';
import Onboarding from './screens/onboarding/Onboarding';

const BottomTabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CreateSessionStack = createStackNavigator();
const OnboardingStack = createStackNavigator();

const OnboardingNavigator = () => (
  <NavigationContainer>
    <OnboardingStack.Navigator>
      <OnboardingStack.Screen
        name="Onboarding"
        component={Onboarding}></OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  </NavigationContainer>
);

const AdminTabNavigator = () => (
  <NavigationContainer>
    <BottomTabs.Navigator
    // tabBar={props => <CurvedTabBar {...props} />}
    >
      <BottomTabs.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarTestID: 'navigate-to-home-button',
        }}
      />

      <BottomTabs.Screen
        name="Session"
        component={CreateSessionNavigator}
        options={{tabBarTestID: 'navigate-to-create-session'}}
      />

      <BottomTabs.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{tabBarTestID: 'navigate-to-profile-button'}}
      />
    </BottomTabs.Navigator>
  </NavigationContainer>
);

const StandardTabNavigator = () => (
  <NavigationContainer>
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="Home"
        component={HomeNavigator}
        options={{tabBarTestID: 'navigate-to-home-button'}}
      />

      <BottomTabs.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{tabBarTestID: 'navigate-to-profile-button'}}
      />
    </BottomTabs.Navigator>
  </NavigationContainer>
);

const HomeNavigator = () => {
  const [selectedServiceUsers, setSelectedServiceUsers] = useState([]);
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home}></HomeStack.Screen>
      <HomeStack.Screen
        name="HomeSession"
        component={Session}></HomeStack.Screen>
      <HomeStack.Screen name="Register" component={Register}></HomeStack.Screen>
      <HomeStack.Screen
        name="Home Volunteer Profile"
        component={WaveTeamProfile}></HomeStack.Screen>
      <HomeStack.Screen
        name="Home ServiceUser Profile"
        component={ServiceUserProfile}></HomeStack.Screen>
      <HomeStack.Screen
        initialParams={{
          setSelectedServiceUsers,
          selectedServiceUsers,
        }}
        name="SessionDetails"
        options={({navigation}) => ({
          title: 'Edit session',
        })}
        component={SessionDetails}
      />
      <HomeStack.Screen
        name="AddServiceUsers"
        component={AddServiceUsers}
        options={{title: 'Edit service users'}}
      />
      <HomeStack.Screen
        name="ConfirmSession"
        component={ConfirmSession}
        options={{title: 'Confirm Edited Session Details'}}
      />
    </HomeStack.Navigator>
  );
};

const CreateSessionNavigator = () => (
  <CreateSessionStack.Navigator>
    <CreateSessionStack.Screen
      name="SessionDetails"
      component={SessionDetails}
      options={{
        title: 'Session Details',
      }}
    />
    <CreateSessionStack.Screen
      name="AddServiceUsers"
      component={AddServiceUsers}
      options={{title: 'Add service users'}}
    />
    <CreateSessionStack.Screen
      name="ConfirmSession"
      component={ConfirmSession}
      options={{title: 'Confirm Session Details'}}
    />
  </CreateSessionStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="Profile"
      component={Profile}></ProfileStack.Screen>
    <ProfileStack.Screen
      name="ProfileSession"
      component={Session}></ProfileStack.Screen>
    <ProfileStack.Screen
      name="Register"
      component={Register}></ProfileStack.Screen>
    <ProfileStack.Screen
      name="Profile Volunteer Profile"
      component={WaveTeamProfile}></ProfileStack.Screen>
    <ProfileStack.Screen
      name="Profile ServiceUser Profile"
      component={ServiceUserProfile}></ProfileStack.Screen>
    <ProfileStack.Screen
      name="SessionDetails"
      options={({navigation}) => ({
        title: 'Edit session',
      })}
      component={SessionDetails}
    />
    <ProfileStack.Screen
      name="AddServiceUsers"
      component={AddServiceUsers}
      options={{title: 'Edit service users'}}
    />
    <ProfileStack.Screen
      name="ConfirmSession"
      component={ConfirmSession}
      options={{title: 'Confirm Edited Session Details'}}
    />
  </ProfileStack.Navigator>
);

const App: () => React$Node = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );

  const userData = useSelector((state) => state.firestoreReducer.userData);

  useEffect(() => {
    if (!isEmpty(currentAuthenticatedUser)) {
      console.log('REQUESTING PERMISSION');
      requestNotificationPermission()
        .then(() => {
          console.log('calling get token ');
          messaging()
            .getToken()
            .then((token) => {
              console.log('RETRIEVED TOKEN');
              addNotificationToken(currentAuthenticatedUser.uid, token);
            })
            .catch((err) => console.log('Error in getToken', err));
        })
        .catch((err) =>
          console.log('Error in requestNotificationPermission', err),
        );
      return () => {
        messaging().onTokenRefresh((token) => {
          addNotificationToken(currentAuthenticatedUser.uid, token);
        });
      };
    }
  }, [currentAuthenticatedUser]);

  useEffect(() => {
    const unsubscribeFromFirebaseAuth = createAuthSubscription();
    return () => {
      unsubscribeFromFirebaseAuth();
    };
  }, []);

  useEffect(() => {
    console.log('currentAuthenticatedUser is ', currentAuthenticatedUser.email);
    if (!isEmpty(currentAuthenticatedUser)) {
      const unsubscribeFromFirestoreUserData = subscribeToFirestoreUsers(
        currentAuthenticatedUser.uid,
      );
      return () => unsubscribeFromFirestoreUserData();
    }
  }, [currentAuthenticatedUser]);

  return isEmpty(currentAuthenticatedUser) ? (
    <Login setLoggedIn={setLoggedIn} />
  ) : userData.isNewUser ? (
    <OnboardingNavigator />
  ) : userHasPermission(userData?.Roles) ? (
    <AdminTabNavigator />
  ) : (
    <StandardTabNavigator />
  );
};

export default App;
