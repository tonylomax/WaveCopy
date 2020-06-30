import React from 'react';
import {View, Text, Image} from 'react-native';
import {AccordionMenu, ConfirmButton} from 'components';
import {Edit_Icon} from 'assets';

export default function Session({navigation, route}) {
  const {Beach, Date, Description, ID, Time} = route.params.item;
  console.log('route.params', route.params.item);
  console.log('item in session', Description);
  return (
    <View>
      <Image style={{height: '15%', width: '15%'}} source={Edit_Icon}></Image>
      <Text>{Date}</Text>
      <Text>{Beach}</Text>
      <Text>{Description}</Text>
      <Text>{ID}</Text>
      <Text>{Time}</Text>
      <AccordionMenu></AccordionMenu>
      <ConfirmButton title="Register">Register</ConfirmButton>
    </View>
  );
}
