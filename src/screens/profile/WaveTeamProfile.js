import React, {useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';

import Moment from 'react-moment';
import moment from 'moment';
import {TrainingAccordionMenu, SessionListAccordionMenu} from 'components';
import 'moment/src/locale/en-gb';

moment.locale('en-gb');
moment().format('en-gb');

export default function WaveTeamProfile({route}) {
  const {mentor} = route.params;

  const volunteerSessions = useSelector((state) => {
    return state.firestoreReducer.sessionData.filter((session) => {
      let filteredMentors = session?.Mentors.filter((filteredMentor) => {
        console.log(filteredMentor.id === mentor.id);
        return filteredMentor.id === mentor.id;
      });
      if (filteredMentors.length >= 1) {
        return true;
      }
    });
  });

  const beaches = useSelector((state) => state.firestoreReducer.beaches);

  useEffect(() => {
    console.log('volunteerSessions in waveteamprofile', volunteerSessions);
  }, [volunteerSessions]);

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
      <SessionListAccordionMenu
        sessions={volunteerSessions}
        beaches={beaches}></SessionListAccordionMenu>
      <Text> Volunteering Area</Text>
      <Text> Training as accordion</Text>
      <Text> Session as accordion</Text>
    </View>
  );
}
