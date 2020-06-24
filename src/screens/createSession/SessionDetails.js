import React, {useState} from 'react';
import {View, Text, SafeAreaView, ScrollView, Button} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SessionDetails({navigation}) {
  const MAX_NUMBER_OF_VOLUNTEERS = 30;
  const [sessionType, setSessionType] = useState('surf-club');
  const [sessionDate, setSessionDate] = useState(new Date());
  const [location, setLocation] = useState('cornwall-fistrall');
  const [numberOfVolunteers, setNumberOfVolunteers] = useState(1);
  // creates an array from [1... max]
  const mapCreator = Array.from(
    Array(MAX_NUMBER_OF_VOLUNTEERS),
    (_, i) => i + 1,
  );

  const onChange = (event, selectedDate) => {
    const date = selectedDate;
    setSessionDate(date);
  };

  return (
    <SafeAreaView>
      <ScrollView testID="session-details-scroll-view">
        <Text testID="create-session-title">Create a session</Text>
        <Text>Session</Text>
        <Picker
          testID="type-of-session"
          selectedValue={sessionType}
          onValueChange={(itemValue, itemIndex) => setSessionType(itemValue)}>
          <Picker.Item label="Surf club" value="surf-club" />
          <Picker.Item label="Surf therapy" value="surf-therapy" />
        </Picker>
        <Text>Date</Text>
        <DateTimePicker
          testID="date-of-session"
          value={sessionDate}
          mode={'date'}
          // is24Hour={true}
          display="default"
          onChange={onChange}
        />
        <Text>Location</Text>
        <Picker
          testID="location-of-session"
          selectedValue={location}
          onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}>
          <Picker.Item label="Devon North" value="devon-north" />
          <Picker.Item label="Cornwall - Fistral" value="cornwall-fistral" />
        </Picker>
        <Text>Amount of volunteers needed</Text>
        <Picker
          testID="number-of-volunteers"
          selectedValue={numberOfVolunteers}
          onValueChange={(itemValue, itemIndex) =>
            setNumberOfVolunteers(itemValue)
          }>
          {mapCreator.map((n) => (
            <Picker.Item label={n.toString()} value={n} key={n} />
          ))}
        </Picker>

        <Button
          testID="continue-to-select-service-users"
          title="Continue"
          onPress={() =>
            navigation.navigate('AddServiceUsers', {
              sessionType,
              sessionDate,
              location,
              numberOfVolunteers,
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
