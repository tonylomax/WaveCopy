import {ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {List, Card, Paragraph, Title, Caption} from 'react-native-paper';
import Moment from 'react-moment';
import moment from 'moment';
import {useSelector} from 'react-redux';

import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {startCase} from 'lodash';

export default function SessionListAccordionMenu({
  sessions,

  navigation,
  route,
}) {
  const beaches = useSelector((state) => state.firestoreReducer.beaches);

  const getBeach = (beachID) => {
    console.log('beachID', beachID);
    console.log('beaches in list', beaches);
    return beaches.find((beach) => beach.id === beachID);
  };
  const [expanded, setExpanded] = useState(false);

  return (
    <ScrollView>
      <View style={{flex: 1, marginBottom: '17.5%'}}>
        <List.Section>
          {/* <List.AccordionGroup> */}
          <List.Accordion
            expanded={sessions.length > 0 ? expanded : false}
            theme={{
              colors: {
                text: sessions.length > 0 ? 'black' : 'grey',
              },
            }}
            onPress={() => {
              setExpanded((expanded) => !expanded);
            }}
            testID="sessionlist-accordian"
            title={sessions.length > 0 ? 'Sessions' : 'No Sessions'}
            id="1">
            {sessions
              ?.sort((a, b) => {
                return new Date(a.dateTime) - new Date(b.dateTime);
              })
              .map((session, i) => {
                const IS_IN_PAST =
                  moment(session?.dateTime).diff(new Date()) < 0;
                return (
                  <List.Item
                    key={i}
                    description={() => {
                      return (
                        <Card
                          onPress={() => {
                            if (!(IS_IN_PAST || route.name !== 'Profile')) {
                              const selectedBeach = getBeach(session.beachID);
                              console.log(
                                'selectedBeach in profile',
                                selectedBeach,
                              );
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
                            {startCase(session?.type?.replace(/-/gi, ' '))}-
                            {session?.beach?.replace(/-/gi, ' ')}
                          </Title>
                          <Card.Content
                            testID={`ProfileSessionsListItem${session.id}`}
                            id={session.id}>
                            <Moment element={Paragraph} format="LLLL">
                              {session?.dateTime}
                            </Moment>
                            <Paragraph>
                              Volunteers: {session?.mentors?.length}/
                              {session?.maxMentors}
                            </Paragraph>
                          </Card.Content>
                        </Card>
                      );
                    }}
                  />
                );
              })}
          </List.Accordion>
          {/* </List.AccordionGroup> */}
        </List.Section>
      </View>
    </ScrollView>
  );
}
