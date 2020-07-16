import React from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput } from 'react-native';
import  Svg,{Path}  from 'react-native-svg';

const WIDTH = Dimensions.get('screen').width;
export default function CurvedTabBar() {
  return (
    
        <Svg
         width={WIDTH} height="205" viewBox="0 0 699 205" fill="none"
          style={{ position: 'absolute', bottom: -50 }}
        >
<Path d="M0 50C180.5 -41.5 565.5 85 699 0V205H0V50Z" fill="#C4C4C4"/>

        </Svg>
    
  );
}


