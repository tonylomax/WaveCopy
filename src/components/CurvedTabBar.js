import React, {useState} from 'react';
import {View, Dimensions, TouchableOpacity, Image, Alert} from 'react-native';
import {Card, Portal, Modal, useTheme} from 'react-native-paper';
import Svg, {Path} from 'react-native-svg';
import {Profile_Icon, Create_Session_Icon, Settings_Icon} from 'assets';
import {CommonActions} from '@react-navigation/native';
import {ConfirmButton, CloseButton} from 'components';
import {COLOURS} from 'styles';

import {useSelector} from 'react-redux';
const WIDTH = Dimensions.get('screen').width;

const imageURI = {
  Home: Profile_Icon,
  Session: Create_Session_Icon,
  Profile: Settings_Icon,
};

export default function CurvedTabBar({state, descriptors, navigation}) {
  const homeIndex = useSelector((state) => state.navigationReducer.index);
  const [discardChangesModalVisible, setDiscardChangesModalVisible] = useState(
    false,
  );
  const [route, setRoute] = useState();

  const toggleDiscardChangesModal = () =>
    setDiscardChangesModalVisible(
      (discardChangesModalVisible) => !discardChangesModalVisible,
    );

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: '3%',
        justifyContent: 'center',
      }}>
      <Svg
        width={WIDTH}
        height="130"
        viewBox="0 0 699 205"
        style={{position: 'absolute', bottom: -50}}>
        <Path
          d="M0 50C180.5 -41.5 565.5 85 699 0V205H0V50Z"
          fill={COLOURS.DARK_GREY}
          fillOpacity={0.7}
        />
      </Svg>
      <Svg
        width={WIDTH}
        height="120"
        viewBox="0 0 699 205"
        fill="none"
        style={{position: 'absolute', bottom: -50}}>
        <Path d="M0 50C180.5 -41.5 565.5 85 699 0V205H0V50Z" fill="#ffffff" />
      </Svg>

      <Portal>
        <Modal
          visible={discardChangesModalVisible}
          onDismiss={toggleDiscardChangesModal}>
          <Card>
            <Card.Title
              titleStyle={{
                fontSize: 14,
                padding: 0,
                alignSelf: 'center',
              }}
              style={{
                marginHorizontal: '1%',
                paddingLeft: '0%',
                paddingRight: '0%',
              }}
              title={'Are you sure you want to discard your changes?'}
            />
            <Card.Actions
              style={{
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <ConfirmButton
                style={{
                  marginHorizontal: '5%',
                  marginBottom: '1%',
                  width: '20%',
                }}
                title="Yes"
                onPress={() => {
                  toggleDiscardChangesModal();
                  if (route === 'Session') {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [{name: 'Session'}],
                      }),
                    );
                  } else if (route === 'Profile') {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 2,
                        routes: [{name: 'Profile'}],
                      }),
                    );
                  }
                }}></ConfirmButton>
              <CloseButton
                style={{
                  marginHorizontal: '5%',
                  marginBottom: '1%',
                  width: '20%',
                }}
                title="No"
                onPress={() => {
                  toggleDiscardChangesModal();
                }}></CloseButton>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>

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

          setRoute(event.target.split('-')[0]);

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
            // Open the modal to confirm the navigation away from home
            toggleDiscardChangesModal();
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
