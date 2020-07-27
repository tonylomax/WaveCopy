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
import {Title, Card, Paragraph, Caption} from 'react-native-paper';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {generateDateTimeArray, generateNumberedArray} from 'utils';
import {
  MIN_NUMBER_OF_VOLUNTEERS,
  MAX_NUMBER_OF_VOLUNTEERS,
  MIN_NUMBER_OF_REPETITIONS,
  MAX_NUMBER_OF_REPETITIONS,
} from 'constants';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function SessionDetails({navigation, route}) {
  const previousSessionData = route?.params?.previousSessionData;
  const previousSessionID = route?.params?.previousSessionID;
  const previouslySelectedAttendees =
    route?.params?.previouslySelectedAttendees;
  const selectedUsers = route?.params?.selectedUsers;
  const previouslySelectedMentors = route?.params?.previouslySelectedMentors;
  const editedDescriptionOfSession = route?.params?.editedDescriptionOfSession;
  const beaches = useSelector((state) => state.firestoreReducer.beaches);

  const [sessionType, setSessionType] = useState(
    previousSessionData?.type || 'surf-club',
  );
  const [location, setLocation] = useState();

  const [numberOfVolunteers, setNumberOfVolunteers] = useState(
    previousSessionData?.maxMentors || 1,
  );
  // Default state is 0, previous state will not exist.
  const [numberOfRepetitions, setNumberOfRepetitions] = useState(0);
  // new Date().setDate(new Date().getDate() + 7),
  const [sessionDate, setSessionDate] = useState(
    moment(new Date()).add(7, 'days').toDate(),
  );
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
    console.log('beaches', beaches);
    console.log(previousSessionData);
    if (previousSessionData?.dateTime) {
      setSessionDate(new Date(previousSessionData?.dateTime));
      setSessionTime(new Date(previousSessionData?.dateTime));
    }
    if (previousSessionData?.beach) {
      const prevBeachIndex = beaches.findIndex(
        (beach) => beach.name === previousSessionData?.beach,
      );
      setLocation(beaches[prevBeachIndex]);
    } else setLocation(beaches[0]);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView testID="session-details-scroll-view">
        {previousSessionData ? (
          <Title>Editing session</Title>
        ) : (
          <Title testID="create-session-title">Create a session</Title>
        )}

        <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
          <Card.Title title="Type of Session" />
          <Picker
            testID="type-of-session"
            selectedValue={sessionType}
            onValueChange={(itemValue, itemIndex) => setSessionType(itemValue)}>
            <Picker.Item label="Surf club" value="surf-club" />
            <Picker.Item label="Surf therapy" value="surf-therapy" />
          </Picker>
        </Card>
        <View>
          {Platform.OS === 'android' && (
            <Button
              onPress={() => setShowDatePicker((current) => !current)}
              title="Show date picker!"
            />
          )}
        </View>

        {showDatePicker && (
          <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
            <Card.Title title="Date of Session" />
            <Caption>
              If you are creating multiple sessions, select the date of the
              first session.
            </Caption>
            <DateTimePicker
              testID="date-of-session"
              value={sessionDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          </Card>
        )}
        <View>
          {Platform.OS === 'android' && (
            <Button
              onPress={() => setShowTimePicker((current) => !current)}
              title="Show time picker!"
            />
          )}
        </View>

        {showTimePicker && (
          <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
            <Card.Title title="Time of Session" />
            <DateTimePicker
              testID="time-of-session"
              value={sessionTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeTime}
            />
          </Card>
        )}

        <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
          <Card.Title title="Location of session" />
          <Picker
            testID="location-of-session"
            selectedValue={location?.name}
            onValueChange={(itemValue, itemIndex) => {
              const ValueToAdd = beaches[itemIndex];
              setLocation(ValueToAdd);
            }}>
            {beaches?.map((beach) => (
              <Picker.Item
                label={beach?.name}
                value={beach?.name}
                id={beach?.name}
                key={beach?.name}
              />
            ))}
          </Picker>
        </Card>
        <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
          <Card.Title title="Number of volunteers" />
          <Caption>The number of volunteers required for this session.</Caption>
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
        </Card>

        {!previousSessionData && (
          <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
            <Card.Title title="Number of repetitions" />
            <Caption>To create a single session, select 0 repetitions.</Caption>
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
          </Card>
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
            console.log({editedDescriptionOfSession});
            navigation.push('AddServiceUsers', {
              sessionType,
              location,
              numberOfVolunteers,
              dateTimeArray,
              previousSessionData,
              previouslySelectedAttendees: selectedUsers
                ? selectedUsers
                : previouslySelectedAttendees,
              previouslySelectedMentors,
              previousSessionID,
              editedDescriptionOfSession,
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
