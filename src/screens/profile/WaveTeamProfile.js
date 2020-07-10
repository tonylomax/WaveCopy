import React, {useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import Moment from 'react-moment';
import moment from 'moment';
import {TrainingAccordionMenu, SessionListAccordionMenu} from 'components';
import 'moment/src/locale/en-gb';

moment.locale('en-gb');
moment().format('en-gb');

export default function WaveTeamProfile({route}) {
  const {mentor} = route.params;

  console.log('mentor in waveteamprofile', mentor);

  return (
    <View>
      <Image></Image>
      <Text>
        {mentor.firstName} {mentor.lastName}
        {', '}
        {moment().diff(mentor.DateOfBirth, 'years')}
      </Text>
      <Text>{mentor.ContactNumber} </Text>
      <Text>{mentor?.Training[0].Name} </Text>
      <TrainingAccordionMenu training={mentor.Training}></TrainingAccordionMenu>
      <SessionListAccordionMenu></SessionListAccordionMenu>
      <Text> Volunteering Area</Text>
      <Text> Training as accordion</Text>
      <Text> Session as accordion</Text>
    </View>
  );
}
