import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Button,
  Platform,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import generateDateTimeArray from '../../utils/time/repetitionDatesArray';
import generateNumberedArray from '../../utils/generateNumberedArray';
import {
  MIN_NUMBER_OF_VOLUNTEERS,
  MAX_NUMBER_OF_VOLUNTEERS,
  MIN_NUMBER_OF_REPETITIONS,
  MAX_NUMBER_OF_REPETITIONS,
} from '../../constants/sessionChoices.js';

const EXAMPLE_LOCATIONS = [
  {
    name: 'Fistral Beach',
    area: 'West Cornwall',
    region: 'South West',
  },
  {
    name: 'Brighton Beach',
    area: 'Brighton',
    region: 'South East',
  },
];

export default function SessionDetails({navigation}) {
  const [sessionType, setSessionType] = useState('surf-club');
  const [location, setLocation] = useState();
  const [numberOfVolunteers, setNumberOfVolunteers] = useState(1);
  const [numberOfRepetitions, setNumberOfRepetitions] = useState(0);
  const [sessionDate, setSessionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [sessionTime, setSessionTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios');

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || sessionDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSessionDate(currentDate);
  };
  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || sessionTime;
    setShowTimePicker(Platform.OS === 'ios');
    setSessionTime(currentTime);
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
        <View>
          {Platform.OS === 'android' && (
            <Button
              onPress={() => setShowDatePicker((current) => !current)}
              title="Show date picker!"
            />
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            testID="date-of-session"
            value={sessionDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}
        <View>
          <Text>Time</Text>
          {Platform.OS === 'android' && (
            <Button
              onPress={() => setShowTimePicker((current) => !current)}
              title="Show time picker!"
            />
          )}
        </View>

        {showTimePicker && (
          <DateTimePicker
            testID="time-of-session"
            value={sessionTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTime}
          />
        )}

        <Text>Location</Text>
        <Picker
          testID="location-of-session"
          selectedValue={location?.name}
          onValueChange={(itemValue, itemIndex) => {
            const ValueToAdd = EXAMPLE_LOCATIONS[itemIndex];
            setLocation(ValueToAdd);
          }}>
          {EXAMPLE_LOCATIONS.map((beach) => (
            <Picker.Item
              label={beach.name}
              value={beach.name}
              id={beach.name}
            />
          ))}
        </Picker>
        <Text>Amount of volunteers needed</Text>
        <Picker
          testID="number-of-volunteers"
          selectedValue={numberOfVolunteers}
          onValueChange={(itemValue, itemIndex) =>
            setNumberOfVolunteers(itemValue)
          }>
          {generateNumberedArray(
            MIN_NUMBER_OF_VOLUNTEERS,
            MAX_NUMBER_OF_VOLUNTEERS,
          ).map((n) => (
            <Picker.Item label={n.toString()} value={n} key={n} />
          ))}
        </Picker>
        <Text>Number of repetitions</Text>
        <Picker
          testID="number-of-repetitions"
          selectedValue={numberOfRepetitions}
          onValueChange={(itemValue, itemIndex) =>
            setNumberOfRepetitions(itemValue)
          }>
          {generateNumberedArray(
            MIN_NUMBER_OF_REPETITIONS,
            MAX_NUMBER_OF_REPETITIONS,
          ).map((n) => (
            <Picker.Item label={n.toString()} value={n} key={n} />
          ))}
        </Picker>

        <Button
          testID="continue-to-select-service-users"
          title="Continue"
          onPress={() => {
            if (!location || location === '0') {
              Alert.alert('please select a location');
            } else {
              const dateTimeArray = generateDateTimeArray(
                sessionDate,
                sessionTime,
                numberOfRepetitions,
              );
              navigation.navigate('AddServiceUsers', {
                sessionType,
                location,
                numberOfVolunteers,
                dateTimeArray,
              });
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
