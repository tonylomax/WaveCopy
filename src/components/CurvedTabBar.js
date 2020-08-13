import React, {useState} from 'react';
import {View, Dimensions, TouchableOpacity, Image, Alert} from 'react-native';
import {Card, Portal, Modal, useTheme, Subheading} from 'react-native-paper';
import Svg, {Path} from 'react-native-svg';
import {Profile_Icon, Create_Session_Icon, Settings_Icon} from 'assets';
import {CommonActions} from '@react-navigation/native';
import {ConfirmButton, CloseButton} from 'components';
import {COLOURS} from 'styles';
import {userHasPermission} from 'utils';

import {useSelector} from 'react-redux';
const WIDTH = Dimensions.get('screen').width;

const imageURI = {
  Home: Profile_Icon,
  Session: Create_Session_Icon,
  Profile: Settings_Icon,
};

export default function CurvedTabBar({state, descriptors, navigation}) {
  const homeIndex = useSelector(
    (state) => state.navigationReducer.navState.index,
  );

  const navState = useSelector((state) => state.navigationReducer.navState);
  const [discardChangesModalVisible, setDiscardChangesModalVisible] = useState(
    false,
  );
  const [route, setRoute] = useState();

  const userData = useSelector((state) => state.firestoreReducer.userData);

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
          <Card
            style={{
              alignItems: 'center',
            }}>
            <Subheading
              style={{
                fontSize: 14,
                padding: 20,
                alignSelf: 'center',
              }}>
              Are you sure you want to discard your changes?
            </Subheading>
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
                  } else if (route === 'Home') {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Home'}],
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

          // Get the screen from which you're navigating
          let origin = navState.routes[navState.routes.length - 1].key.split(
            '-',
          )[0];
          // CONDITIONAL NAV FOR ADMINS i.e. PEOPLE WHO SEE 3 TAB BUTTONS
          if (userHasPermission(userData?.roles)) {
            //If the navigation is going to home or profile and the current stack is Create Session, open the modal to confirm nav
            if (
              (route.name === 'Home' || route.name === 'Profile') &&
              state.index === 1
            ) {
              toggleDiscardChangesModal();

              //If the navigation is going to home, always reset the stack to prevent duplicate session subscriptions
            } else if (route.name === 'Home') {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              );
            }
            // If you're on home stack and the home index and you're on an edit session page then open the modal to confirm nav
            else if (
              homeIndex >= 2 &&
              (origin === 'SessionDetails' ||
                origin === 'AddServiceUsers' ||
                origin === 'ConfirmSession')
            ) {
              toggleDiscardChangesModal();
              //Otherwise navigate normally
            } else if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              // Other otherwise, a bad thing happened or you clicked on the tab you're already on
            } else {
              console.log('NAVIGATION NOT HANDLED');
            }
          }
          // CONDITIONAL NAV FOR SURF MENTORS i.e. PEOPLE WHO SEE 2 TAB BUTTONS
          else {
            //If the navigation is going to home, always reset the stack to prevent duplicate session subscriptions

            if (route.name === 'Home') {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              );
            }
            // If you're on home stack and the home index and you're on an edit session page then open the modal to confirm nav
            else if (
              homeIndex >= 2 &&
              (origin === 'SessionDetails' ||
                origin === 'AddServiceUsers' ||
                origin === 'ConfirmSession')
            ) {
              toggleDiscardChangesModal();
              //Otherwise navigate normally
            } else if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              // Other otherwise, a bad thing happened or you clicked on the tab you're already on
            } else {
              console.log('NAVIGATION NOT HANDLED');
            }
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
