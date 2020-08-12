import React from 'react';
import {Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {COLOURS} from 'styles';
import {LogoSquareBlueUnnamed, WaveSpinner} from 'assets';

export default function LoadingScreen({visible, isSpinning}) {
  return isSpinning ? (
    <Spinner
      visible={visible}
      //   textStyle={}
      overlayColor={COLOURS.WHITE}
      customIndicator={
        <Image style={{width: 100, height: 100}} source={WaveSpinner} />
      }
    />
  ) : (
    <Spinner
      visible={visible}
      //   textStyle={}
      overlayColor={COLOURS.WHITE}
      customIndicator={<LogoSquareBlueUnnamed />}
    />
  );
}
