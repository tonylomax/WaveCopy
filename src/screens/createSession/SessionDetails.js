import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Button,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SessionDetails({navigation}) {
  const MAX_NUMBER_OF_VOLUNTEERS = 30;
  const MAX_NUMBER_OF_REPETITIONS = 10;
  const [sessionType, setSessionType] = useState('surf-club');
  const [location, setLocation] = useState('cornwall-fistrall');
  const [numberOfVolunteers, setNumberOfVolunteers] = useState(1);
  const [numberOfRepetitions, setNumberOfRepetitions] = useState(0);

  const [sessionDate, setSessionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [sessionTime, setSessionTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios');

  // creates an array from [1... max]
  const mapCreator = (max, min) => Array.from(Array(max), (_, i) => i + min);

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
          {mapCreator(MAX_NUMBER_OF_VOLUNTEERS, 1).map((n) => (
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
          {mapCreator(MAX_NUMBER_OF_REPETITIONS, 0).map((n) => (
            <Picker.Item label={n.toString()} value={n} key={n} />
          ))}
        </Picker>

        <Button
          testID="continue-to-select-service-users"
          title="Continue"
          onPress={() => {
            console.log(sessionTime);
            navigation.navigate('AddServiceUsers', {
              sessionType,
              sessionDate,
              sessionTime,
              location,
              numberOfVolunteers,
              numberOfRepetitions,
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
