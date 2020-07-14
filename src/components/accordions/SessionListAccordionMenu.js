import React, {useEffect} from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {List} from 'react-native-paper';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function SessionListAccordionMenu({
  sessions,
  beaches,
  navigation,
}) {
  const getBeach = (beachID) => beaches.filter((beach) => (beach.id = beachID));

  return (
    <List.AccordionGroup>
      <List.Accordion testID="sessionlist-accordian" title={'Sessions'} id="1">
        {sessions?.map((session, i) => {
          const IS_IN_PAST = moment(session?.DateTime).diff(new Date()) < 0;
          return (
            <List.Item
              key={i}
              title={session.Type}
              description={() => {
                return (
                  <TouchableHighlight
                    disabled={IS_IN_PAST}
                    onPress={() => {
                      const selectedBeach = getBeach(session.ID)[0];
                      console.log('selectedBeach', selectedBeach);
                      // navigation.navigate('Session', {session, selectedBeach});
                    }}
                    style={{
                      borderColor: IS_IN_PAST ? 'grey' : 'black',
                      backgroundColor: IS_IN_PAST ? 'grey' : '',
                      borderWidth: 2,
                      marginBottom: '2%',
                    }}>
                    <View
                      testID={`ProfileSessionsListItem${session.ID}`}
                      id={session.ID}>
                      <Text> {session?.Type} </Text>
                      <Text> {session?.Beach} </Text>
                      <Text> {session?.DateTime} </Text>
                      <Text>
                        Volunteers: {session?.Mentors?.length}/
                        {session?.MaxMentors}
                      </Text>
                    </View>
                  </TouchableHighlight>
                );
              }}
            />
          );
        })}
      </List.Accordion>
    </List.AccordionGroup>
  );
}
