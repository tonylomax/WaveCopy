import React from 'react';
import {Text, View} from 'react-native';

export default function AccordianMenu({testID, title, data, type}) {
  switch (type) {
    case 'attendees':
      return (
        <View>
          <Text testID={testID}>{title}</Text>
          {data?.map((user, i) => (
            <Text>
              {i + 1}) {user?.firstName} {user?.lastName}
            </Text>
          ))}
        </View>
      );
    case 'location':
      return (
        <View>
          <Text testID={testID}>{title}</Text>
          <Text>Map</Text>
          <Text>{data?.Address?.FirstLine}</Text>
          <Text>{data?.Address?.SecondLine}</Text>
          <Text>{data?.Address?.Postcode}</Text>
          <Text>Parking</Text>
          <Text>{data.Parking}</Text>
          <Text>Toilets</Text>
          <Text>{data.Toilets}</Text>
        </View>
      );
    default:
      return <Text testID={testID}>{title}</Text>;
      break;
  }
}
