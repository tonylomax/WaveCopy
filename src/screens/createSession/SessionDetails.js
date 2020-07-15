import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Button,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {generateDateTimeArray, generateNumberedArray} from 'utils';
import {
  MIN_NUMBER_OF_VOLUNTEERS,
  MAX_NUMBER_OF_VOLUNTEERS,
  MIN_NUMBER_OF_REPETITIONS,
  MAX_NUMBER_OF_REPETITIONS,
} from 'constants';

export default function SessionDetails({navigation, route}) {
  const previousSessionData = route?.params?.previousSessionData;
  const previousSessionID = route?.params?.previousSessionID;
  const previouslySelectedAttendees =
    route?.params?.previouslySelectedAttendees;
  const previouslySelectedMentors = route?.params?.previouslySelectedMentors;
  const beaches = useSelector((state) => state.firestoreReducer.beaches);

  const [sessionType, setSessionType] = useState(
    previousSessionData?.Type || 'surf-club',
  );
  const [location, setLocation] = useState(beaches[0]);

  const [numberOfVolunteers, setNumberOfVolunteers] = useState(
    previousSessionData?.MaxMentors || 1,
  );
  // Default state is 0, previous state will not exist.
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

  useEffect(() => {
    console.log(previousSessionData);
    if (previousSessionData?.DateTime) {
      setSessionDate(new Date(previousSessionData?.DateTime));
      setSessionTime(new Date(previousSessionData?.DateTime));
    }
    if (previousSessionData?.Beach) {
      const prevBeachIndex = beaches.findIndex(
        (beach) => beach.Name === previousSessionData?.Beach,
      );
      setLocation(beaches[prevBeachIndex]);
    }
  }, []);

  return (
    <SafeAreaView>
      <ScrollView testID="session-details-scroll-view">
        {previousSessionData ? (
          <Text>Editing session</Text>
        ) : (
          <Text testID="create-session-title">Create a session</Text>
        )}

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
          // <Text>test</Text>
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
          selectedValue={location?.Name}
          onValueChange={(itemValue, itemIndex) => {
            const ValueToAdd = beaches[itemIndex];
            setLocation(ValueToAdd);
          }}>
          {beaches?.map((beach) => (
            <Picker.Item
              label={beach?.Name}
              value={beach?.Name}
              id={beach?.Name}
              key={beach?.Name}
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
        {!previousSessionData && (
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
        )}

        <Button
          testID="continue-to-select-service-users"
          title="Continue"
          onPress={() => {
            const dateTimeArray = generateDateTimeArray(
              sessionDate,
              sessionTime,
              numberOfRepetitions,
            );
            navigation.push('AddServiceUsers', {
              sessionType,
              location,
              numberOfVolunteers,
              dateTimeArray,
              previousSessionData,
              previouslySelectedAttendees,
              previouslySelectedMentors,
              previousSessionID,
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
