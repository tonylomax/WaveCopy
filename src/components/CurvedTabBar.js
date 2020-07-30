import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {Profile_Icon, Create_Session_Icon, Settings_Icon} from 'assets';
import {CommonActions} from '@react-navigation/native';

import {useSelector} from 'react-redux';
const WIDTH = Dimensions.get('screen').width;

const imageURI = {
  Home: Profile_Icon,
  Session: Create_Session_Icon,
  Profile: Settings_Icon,
};

export default function CurvedTabBar({state, descriptors, navigation}) {
  const homeIndex = useSelector((state) => state.navigationReducer.index);

  useEffect(() => {
    console.log('homeIndex', homeIndex);
  }, [homeIndex]);

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: '5%',
        justifyContent: 'center',
      }}>
      <Svg
        width={WIDTH}
        height="150"
        viewBox="0 0 699 205"
        fill="none"
        style={{position: 'absolute', bottom: -50}}>
        <Path d="M0 50C180.5 -41.5 565.5 85 699 0V205H0V50Z" fill="#ffffff" />
      </Svg>

      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // Handle the press of a tab
        const onPress = (e) => {
          //Stop the default behaviour
          e.preventDefault();

          //Get the type of the press
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          //If the navigation is going to home, reset the stack to the main page to prevent conflicting session subscriptions
          if (route.name === 'Home') {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Home'}],
              }),
            );
            //When navigating away from the stack, check the home stack index to see if the user is on a page
            // that has unsaved changes, if they are, throw an alert.
          } else if (homeIndex >= 2) {
            Alert.alert(
              'Your changes won"t be saved"',
              'Are you sure you want to discard your changes',
              [
                {
                  text: 'Yes',
                  onPress: () =>
                    navigation.dispatch(
                      CommonActions.navigate({
                        name: 'Profile',
                      }),
                    ),
                },
                {
                  text: 'No',
                  onPress: () => console.log('No'),
                },
              ],
              {cancelable: false},
            );
            //Otherwise navigate normally
          } else if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
            // Other otherwise, a bad thing happened
          } else {
            console.log('NAVIGATION NOT HANDLED');
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1}}>
            <Image
              style={{
                alignSelf: 'center',
                tintColor: isFocused ? '#2a306c' : '#c4c4c4',
              }}
              source={imageURI[label]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
