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

  // Find sessions that a volunteer is signed up for
  const volunteerSessions = useSelector((state) =>
    state.firestoreReducer.sessionData.filter((session) =>
      session?.Mentors.some(
        (filteredMentor) => filteredMentor.id === mentor.id,
      ),
    ),
  );
  const allSessions = useSelector(
    (state) => state.firestoreReducer.sessionData,
  );

  useEffect(() => {
    console.log('all sessions ', allSessions);
  }, []);

  const beaches = useSelector((state) => state.firestoreReducer.beaches);

  return (
    <View>
      {/* Place holder for profile pic */}
      <Image></Image>
      {/* Mentor name and age */}
      <Text>
        {mentor.firstName} {mentor.lastName}
        {', '}
        {moment().diff(mentor.DateOfBirth, 'years')}
      </Text>
      <Text>{mentor.ContactNumber} </Text>

      <TrainingAccordionMenu training={mentor.Training}></TrainingAccordionMenu>
      <SessionListAccordionMenu
        sessions={volunteerSessions}
        beaches={beaches}></SessionListAccordionMenu>
    </View>
  );
}
