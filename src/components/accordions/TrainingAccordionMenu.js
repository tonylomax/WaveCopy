import React, {useState} from 'react';
import {Text} from 'react-native';
import {List, Card, Paragraph} from 'react-native-paper';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function TrainingAccordionMenu({training}) {
  const [expanded, setExpanded] = useState(false);

  return (
    // <List.AccordionGroup>
    <List.Accordion
      testID="training-accordian"
      title={training?.length > 0 ? 'Training' : 'No Training'}
      id="1"
      expanded={training?.length > 0 ? expanded : false}
      theme={{
        colors: {
          text: training?.length > 0 ? 'black' : 'grey',
        },
      }}
      onPress={() => {
        setExpanded((expanded) => !expanded);
      }}>
      {training?.map((trainingInstance, i) => {
        return (
          <List.Item
            key={i}
            // title={trainingInstance.name}
            description={() => {
              return (
                <Card>
                  <Card.Title title={trainingInstance.name} />
                  <Card.Content>
                    <Paragraph>Completed: </Paragraph>
                    <Paragraph>
                      <Moment element={Text} format="MMMM YYYY">
                        {trainingInstance.dateCompleted}
                      </Moment>
                    </Paragraph>
                  </Card.Content>
                </Card>
              );
            }}
          />
        );
      })}
    </List.Accordion>
    // </List.AccordionGroup>
  );
}
