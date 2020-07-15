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

const BottomTabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CreateSessionStack = createStackNavigator();
const EditSessionStack = createStackNavigator();

const AdminTabNavigator = () => (
  <NavigationContainer>
    <BottomTabs.Navigator>
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

const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={Home}></HomeStack.Screen>
    <HomeStack.Screen name="HomeSession" component={Session}></HomeStack.Screen>
    <HomeStack.Screen name="Register" component={Register}></HomeStack.Screen>
    <HomeStack.Screen
      name="Home Volunteer Profile"
      component={WaveTeamProfile}></HomeStack.Screen>
    <HomeStack.Screen
      name="Home ServiceUser Profile"
      component={ServiceUserProfile}></HomeStack.Screen>
    <HomeStack.Screen
      name="HomeEditSession"
      component={EditSessionNavigator}
      options={{title: 'Edit session'}}></HomeStack.Screen>
  </HomeStack.Navigator>
);

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
      options={{title: 'EDIT PAGE'}}
    />
  </CreateSessionStack.Navigator>
);

const EditSessionNavigator = ({route}) => {
  const {params} = route;
  useEffect(() => {
    console.log(params);
  }, []);
  // console.log('came into edit session', route.name);
  return (
    <EditSessionStack.Navigator>
      <EditSessionStack.Screen
        name="SessionDetails"
        component={SessionDetails}
        initialParams={params}
      />
      <EditSessionStack.Screen
        name="AddServiceUsers"
        component={AddServiceUsers}
        navigationOptions
      />
      <EditSessionStack.Screen
        name="ConfirmSession"
        component={ConfirmSession}
        options={{title: 'EDIT PAGE'}}
      />
    </EditSessionStack.Navigator>
  );
};

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
      name="ProfileEditSession"
      options={({navigation}) => ({
        title: 'Edit session',
      })}
      component={EditSessionNavigator}></ProfileStack.Screen>
  </ProfileStack.Navigator>
);

const App: () => React$Node = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );

  const userData = useSelector((state) => state.firestoreReducer.userData);

  useEffect(() => {
    const unsubscribeFromFirebaseAuth = createAuthSubscription();
    return () => {
      unsubscribeFromFirebaseAuth();
    };
  }, []);

  useEffect(() => {
    console.log('currentAuthenticatedUser is ', currentAuthenticatedUser);
    if (!isEmpty(currentAuthenticatedUser)) {
      const unsubscribeFromFirestoreUserData = subscribeToFirestoreUsers(
        currentAuthenticatedUser.uid,
      );
      return () => unsubscribeFromFirestoreUserData();
    }
  }, [currentAuthenticatedUser]);

  return isEmpty(currentAuthenticatedUser) ? (
    <Login setLoggedIn={setLoggedIn} />
  ) : userHasPermission(userData?.Roles) ? (
    <AdminTabNavigator />
  ) : (
    <StandardTabNavigator />
  );
};

export default App;
