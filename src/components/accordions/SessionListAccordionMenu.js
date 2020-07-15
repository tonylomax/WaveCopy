import React, {useEffect} from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {List, Card, Paragraph} from 'react-native-paper';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function SessionListAccordionMenu({
  sessions,
  beaches,
  navigation,
  route,
}) {
  const getBeach = (beachID) => beaches.filter((beach) => (beach.id = beachID));

  useEffect(() => {
    console.log('route in sessionlist accordion menu', route);
    console.log('route name in sessionlist accordion menu', route?.name);
  }, [route]);

  return (
    <List.AccordionGroup>
      <List.Accordion testID="sessionlist-accordian" title={'Sessions'} id="1">
        {sessions?.map((session, i) => {
          const IS_IN_PAST = moment(session?.DateTime).diff(new Date()) < 0;
          return (
            <List.Item
              key={i}
              description={() => {
                return (
                  <Card
                    onPress={() => {
                      if (!(IS_IN_PAST || route.name !== 'Profile')) {
                        const selectedBeach = getBeach(session.ID)[0];
                        console.log('selectedBeach', selectedBeach);
                        if (route.name === 'Profile') {
                          navigation.navigate('ProfileSession', {
                            session,
                            selectedBeach,
                          });
                        }
                      }
                    }}
                    style={{
                      borderColor: IS_IN_PAST ? 'grey' : 'black',
                      backgroundColor: IS_IN_PAST ? 'grey' : '',
                      borderWidth: 2,
                      marginBottom: '2%',
                    }}>
                    <Card.Title title={session.Type} />
                    <Card.Content
                      testID={`ProfileSessionsListItem${session.ID}`}
                      id={session.ID}>
                      <Paragraph> {session?.Type} </Paragraph>
                      <Paragraph> {session?.Beach} </Paragraph>
                      <Paragraph> {session?.DateTime} </Paragraph>
                      <Paragraph>
                        Volunteers: {session?.Mentors?.length}/
                        {session?.MaxMentors}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                );
              }}
            />
          );
        })}
      </List.Accordion>
    </List.AccordionGroup>
  );
}