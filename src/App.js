import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {
  NavigationContainer,
  useNavigationState,
} from '@react-navigation/native';
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
import {CurvedTabBar, BackButton} from 'components';
import messaging from '@react-native-firebase/messaging';
import Onboarding from './screens/onboarding/Onboarding';
import SplashScreen from 'react-native-splash-screen';

const BottomTabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CreateSessionStack = createStackNavigator();
const OnboardingStack = createStackNavigator();

let homeStackIndex;

const OnboardingNavigator = () => (
  <NavigationContainer>
    <OnboardingStack.Navigator>
      <OnboardingStack.Screen
        options={() => ({
          headerShown: false,
        })}
        name="Onboarding"
        component={Onboarding}></OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  </NavigationContainer>
);

const AdminTabNavigator = ({navigation}) => {
  return (
    <NavigationContainer>
      <BottomTabs.Navigator
        lazy={false}
        tabBar={(props) => <CurvedTabBar {...props} />}>
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
          s
        />
      </BottomTabs.Navigator>
    </NavigationContainer>
  );
};

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

const HomeNavigator = ({navigation, route}) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}></HomeStack.Screen>
      <HomeStack.Screen
        name="HomeSession"
        component={Session}
        options={({navigation}) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitleStyle: {
            color: 'white',
            alignSelf: 'center',
            backgroundColor: 'transparent',
          },
          headerLeft: () => (
            <BackButton isLight={true} onPress={() => navigation.goBack()} />
          ),
          headerTitle: '',
        })}></HomeStack.Screen>
      <HomeStack.Screen
        name="Register"
        component={Register}
        options={({navigation}) => ({
          title: '',
          headerTransparent: true,
          headerTitleStyle: {textAlign: 'center'},
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerRight: () => <View />,
        })}></HomeStack.Screen>
      <HomeStack.Screen
        name="Home Volunteer Profile"
        component={WaveTeamProfile}
        options={({navigation}) => ({
          headerTitle: '',
          headerTransparent: true,
          headerTitleStyle: {textAlign: 'center'},
          headerLeft: () => (
            <BackButton isLight={true} onPress={() => navigation.goBack()} />
          ),
          headerRight: () => <View />,
        })}></HomeStack.Screen>
      <HomeStack.Screen
        name="Home ServiceUser Profile"
        component={ServiceUserProfile}
        options={({navigation}) => ({
          headerTitle: '',
          headerTransparent: true,
          headerTitleStyle: {textAlign: 'center'},
          headerLeft: () => (
            <BackButton isLight={true} onPress={() => navigation.goBack()} />
          ),
          headerRight: () => <View />,
        })}></HomeStack.Screen>
      <HomeStack.Screen
        name="SessionDetails"
        options={({navigation}) => ({
          title: 'Edit session',
          headerTitleStyle: {textAlign: 'center'},
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerRight: () => <View />,
        })}
        component={SessionDetails}
      />
      <HomeStack.Screen
        name="AddServiceUsers"
        component={AddServiceUsers}
        options={{
          title: 'Edit service users',
          headerTitleStyle: {textAlign: 'center'},
          headerRight: () => <View />,
        }}
      />
      <HomeStack.Screen
        name="ConfirmSession"
        component={ConfirmSession}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitleStyle: {
            color: 'white',
            alignSelf: 'center',
            backgroundColor: 'transparent',
          },
          title: '',
        }}
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
        headerTitleStyle: {textAlign: 'center'},
      }}
    />
    <CreateSessionStack.Screen
      name="AddServiceUsers"
      component={AddServiceUsers}
      options={{
        title: 'Add service users',
        headerTitleStyle: {textAlign: 'center'},
        headerRight: () => <View />,
      }}
    />
    <CreateSessionStack.Screen
      name="ConfirmSession"
      component={ConfirmSession}
      options={{
        headerShown: true,
        headerTransparent: true,
        headerTitleStyle: {
          color: 'white',
          alignSelf: 'center',
          textAlign: 'center',
        },
        title: '',
      }}
    />
  </CreateSessionStack.Navigator>
);

const ProfileNavigator = ({navigation, route}) => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          headerTitleStyle: {textAlign: 'center'},
        }}></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileSession"
        component={Session}
        options={({navigation}) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitleStyle: {
            color: 'white',
            alignSelf: 'center',
            backgroundColor: 'transparent',
          },
          title: '',
          headerLeft: () => (
            <BackButton isLight={true} onPress={() => navigation.goBack()} />
          ),
          headerTitleAlign: 'center',
        })}></ProfileStack.Screen>
      <ProfileStack.Screen
        name="Register"
        component={Register}
        options={({navigation}) => ({
          title: '',
          headerTitleStyle: {textAlign: 'center'},
          headerTransparent: true,
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerRight: () => <View />,
        })}></ProfileStack.Screen>
      <ProfileStack.Screen
        name="Profile Volunteer Profile"
        component={WaveTeamProfile}
        options={({navigation}) => ({
          headerTitle: '',
          headerTransparent: true,
          headerTitleStyle: {textAlign: 'center'},
          headerLeft: () => (
            <BackButton isLight={true} onPress={() => navigation.goBack()} />
          ),
          headerRight: () => <View />,
        })}></ProfileStack.Screen>
      <ProfileStack.Screen
        name="Profile ServiceUser Profile"
        component={ServiceUserProfile}
        options={({navigation}) => ({
          headerTitle: '',
          headerTransparent: true,
          headerTitleStyle: {textAlign: 'center'},
          headerLeft: () => (
            <BackButton isLight={true} onPress={() => navigation.goBack()} />
          ),
          headerRight: () => <View />,
        })}></ProfileStack.Screen>
      <ProfileStack.Screen
        name="SessionDetails"
        options={({navigation}) => ({
          title: 'Edit session',
          headerTitleStyle: {textAlign: 'center'},
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
        component={SessionDetails}
      />
      <ProfileStack.Screen
        name="AddServiceUsers"
        component={AddServiceUsers}
        options={{
          title: 'Edit service users',
          headerTitleStyle: {textAlign: 'center'},
          headerRight: () => <View />,
        }}
      />
      <ProfileStack.Screen
        name="ConfirmSession"
        component={ConfirmSession}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitleStyle: {
            color: 'white',
            alignSelf: 'center',
            backgroundColor: 'transparent',
          },
          title: '',
          headerRight: () => <View />,
        }}
      />
    </ProfileStack.Navigator>
  );
};

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
    SplashScreen.hide();
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
  ) : userData?.isNewUser ? (
    <OnboardingNavigator />
  ) : userHasPermission(userData?.roles) ? (
    <AdminTabNavigator />
  ) : (
    <StandardTabNavigator />
  );
};

export default App;
