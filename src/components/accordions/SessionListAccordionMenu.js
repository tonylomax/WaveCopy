import {ScrollView, View} from 'react-native';
import React, {useEffect} from 'react';
import {List, Card, Paragraph, Title} from 'react-native-paper';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {startCase} from 'lodash';

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
    <ScrollView>
      <View style={{flex: 1, marginBottom: '17.5%'}}>
        <List.AccordionGroup>
          <List.Accordion
            testID="sessionlist-accordian"
            title={'Sessions'}
            id="1">
            {sessions
              ?.sort((a, b) => {
                return new Date(a.DateTime) - new Date(b.DateTime);
              })
              .map((session, i) => {
                const IS_IN_PAST =
                  moment(session?.DateTime).diff(new Date()) < 0;
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
                          <Title style={{alignSelf: 'center'}}>
                            {startCase(session?.Type?.replace(/-/gi, ' '))}-
                            {session?.Beach?.replace(/-/gi, ' ')}
                          </Title>
                          <Card.Content
                            testID={`ProfileSessionsListItem${session.ID}`}
                            id={session.ID}>
                            <Moment element={Paragraph} format="LLLL">
                              {session?.DateTime}
                            </Moment>
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
      </View>
    </ScrollView>
  );
}
