import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {List} from 'react-native-paper';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function SessionListAccordionMenu({}) {
  return (
    <List.AccordionGroup>
      <List.Accordion testID="sessionlist-accordian" title={'Sessions'} id="1">
        {/* {training.map((trainingInstance, i) => {
          return (
            <List.Item
              key={i}
              title={trainingInstance.Name}
              description={() => {
                return (
                  <Text>
                    Completed:{' '}
                    <Moment element={Text} format="MMMM YYYY">
                      {trainingInstance.DateCompleted}
                    </Moment>
                  </Text>
                );
              }}
            />
          );
        })} */}
      </List.Accordion>
    </List.AccordionGroup>
  );
}
