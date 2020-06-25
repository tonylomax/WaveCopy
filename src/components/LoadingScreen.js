import React from 'react';
import {Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {COLOURS} from 'styles';

export default function LoadingScreen({visible}) {
  return (
    <Spinner
      visible={visible}
      textContent={'Loading...'}
      //   textStyle={}
      overlayColor={COLOURS.WHITE}
      customIndicator={
        <Image
          //   style={}
          source={require('../assets/images/logos/Logo_Square_Blue_Unnamed.png')}
        />
      }
    />
  );
}
