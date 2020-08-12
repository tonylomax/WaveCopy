import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Button,
  Platform,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Title, Card, Paragraph, Caption, Subheading} from 'react-native-paper';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  generateDateTimeArray,
  generateNumberedArray,
  setHomeIndex,
} from 'utils';
import {
  MIN_NUMBER_OF_VOLUNTEERS,
  MAX_NUMBER_OF_VOLUNTEERS,
  MIN_NUMBER_OF_REPETITIONS,
  MAX_NUMBER_OF_REPETITIONS,
} from 'constants';
import {ConfirmButton} from 'components';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {useNavigationState} from '@react-navigation/native';

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

  useEffect(() => {
    console.log({previouslySelectedAttendees});
  }, [previouslySelectedAttendees]);
  // Default state is 0, previous state will not exist.
  const [numberOfRepetitions, setNumberOfRepetitions] = useState(0);
  const [sessionDate, setSessionDate] = useState(
    moment(new Date()).add(7, 'days').toDate(),
  );
  [showSessionType, setShowSessionType] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sessionTime, setSessionTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  [showLocationPicker, setShowLocationPicker] = useState(false);
  [showNumberOfVolunteersPicker, setShowNumberOfVolunteersPicker] = useState(
    false,
  );
  [showNumberOfRepetitions, setShowNumberOfRepetitions] = useState(false);

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

  const closeAllExcept = (exceptThis) => {
    setShowSessionType(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowLocationPicker(false);
    setShowNumberOfVolunteersPicker(false);
    setShowNumberOfRepetitions(false);
    exceptThis(true);
  };

  useEffect(() => {
    // console.log('beaches', beaches);
    console.log(previousSessionData);
    if (previousSessionData?.dateTime) {
      setSessionDate(new Date(previousSessionData?.dateTime));
      setSessionTime(new Date(previousSessionData?.dateTime));
    }
  }, []);

  useEffect(() => {
    if (beaches) {
      if (previousSessionData?.beach) {
        const prevBeachIndex = beaches.findIndex(
          (beach) => beach.name === previousSessionData?.beach,
        );
        setLocation(beaches[prevBeachIndex]);
      } else setLocation(beaches[0]);
    }
  }, [beaches]);

  const navState = useNavigationState((state) => state);

  useEffect(() => {
    console.log('navState', navState);
    setHomeIndex(navState.index);
  }, [navState]);

  return (
    <SafeAreaView>
      <ScrollView
        style={{marginBottom: '5%'}}
        testID="session-details-scroll-view"
        ref={(scrollView) => (this.scrollView = scrollView)}>
        <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
          <Card.Title title="Type of Session" />
          {Platform.OS === 'ios' && (
            <Subheading>
              {sessionType === 'surf-club' ? 'Surf Club' : 'Surf Therapy'}
            </Subheading>
          )}
          {Platform.OS === 'ios' && (
            <ConfirmButton
              title={`${showSessionType ? 'Close' : 'Change'}`}
              onPress={() => {
                if (!showSessionType) {
                  closeAllExcept(setShowSessionType);
                } else {
                  setShowSessionType(false);
                }
              }}
            />
          )}
          {(showSessionType || Platform.OS === 'android') && (
            <Picker
              testID="type-of-session"
              selectedValue={sessionType}
              onValueChange={(itemValue, itemIndex) =>
                setSessionType(itemValue)
              }>
              <Picker.Item label="Surf club" value="surf-club" />
              <Picker.Item label="Surf therapy" value="surf-therapy" />
            </Picker>
          )}
        </Card>

        <Card
          style={{
            padding: '5%',
            margin: '2%',
          }}
          elevation={2}>
          <ConfirmButton
            onPress={() => {
              if (!showDatePicker) {
                closeAllExcept(setShowDatePicker);
              } else {
                setShowDatePicker(false);
              }
            }}
            title={`${showDatePicker ? 'Close' : 'Change'}`}
          />
          <Card.Title title="Date of Session" />
          <Moment element={Subheading} format="LL">
            {sessionDate}
          </Moment>
          <Caption>
            If you are creating multiple sessions, select the date of the first
            session.
          </Caption>
          {showDatePicker && (
            <View>
              <DateTimePicker
                testID="date-of-session"
                value={sessionDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            </View>
          )}
        </Card>

        <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
          <ConfirmButton
            onPress={() => {
              if (!showTimePicker) {
                closeAllExcept(setShowTimePicker);
              } else {
                setShowTimePicker(false);
              }
            }}
            title={`${showTimePicker ? 'Close' : 'Change'}`}
          />
          <Card.Title title="Time of Session" />
          <Moment element={Subheading} format="HH:mm">
            {sessionTime}
          </Moment>
          {showTimePicker && (
            <View>
              <DateTimePicker
                testID="time-of-session"
                value={sessionTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeTime}
              />
            </View>
          )}
        </Card>

        <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
          {Platform.OS === 'ios' && (
            <ConfirmButton
              onPress={() => {
                if (!showLocationPicker) {
                  closeAllExcept(setShowLocationPicker);
                } else {
                  setShowLocationPicker(false);
                }
              }}
              title={`${showLocationPicker ? 'Close' : 'Change'}`}
            />
          )}
          <Card.Title title="Location of session" />
          {Platform.OS === 'ios' && <Subheading>{location?.name}</Subheading>}
          {(showLocationPicker || Platform.OS === 'android') && (
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
          )}
        </Card>
        <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
          {Platform.OS === 'ios' && (
            <ConfirmButton
              onPress={() => {
                if (!showNumberOfVolunteersPicker) {
                  closeAllExcept(setShowNumberOfVolunteersPicker);
                } else {
                  setShowNumberOfVolunteersPicker(false);
                }
              }}
              title={`${showNumberOfVolunteersPicker ? 'Close' : 'Change'}`}
            />
          )}
          <Card.Title title="Number of volunteers" />
          {Platform.OS === 'ios' && (
            <Subheading>{numberOfVolunteers}</Subheading>
          )}
          <Caption>The number of volunteers required for this session.</Caption>

          {(showNumberOfVolunteersPicker || Platform.OS === 'android') && (
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
          )}
        </Card>

        {!previousSessionData && (
          <Card style={{padding: '5%', margin: '2%'}} elevation={2}>
            {Platform.OS === 'ios' && (
              <ConfirmButton
                onPress={() => {
                  if (!showNumberOfRepetitions) {
                    // WARNING THIS MAY NEED TO BE REMOVED
                    // Close all the pickers except the number of reps picker and scroll to bottom after react has
                    // re-rendered the scroll view.
                    closeAllExcept(setShowNumberOfRepetitions);
                    setTimeout(() => {
                      this.scrollView.scrollToEnd();
                    }, 0);
                    // WARNING THIS MAY NEED TO BE REMOVED
                  } else {
                    setShowNumberOfRepetitions(false);
                  }
                }}
                title={`${showNumberOfRepetitions ? 'Close' : 'Change'}`}
              />
            )}
            <Card.Title title="Number of extra sessions" />
            {Platform.OS === 'ios' && (
              <Subheading>{numberOfRepetitions}</Subheading>
            )}
            <Caption>
              To create a single session, select 0. If you want to create, for
              example, 6 total sessions, select 5.
            </Caption>
            {(showNumberOfRepetitions || Platform.OS === 'android') && (
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
          </Card>
        )}

        <ConfirmButton
          style={{marginBottom: '2%'}}
          testID="continue-to-select-service-users"
          title="Continue"
          onPress={() => {
            const dateTimeArray = generateDateTimeArray(
              sessionDate,
              sessionTime,
              numberOfRepetitions,
            );
            console.log({editedDescriptionOfSession});
            if (previouslySelectedMentors?.length > numberOfVolunteers) {
              Alert.alert(
                'The maximum number of volunteers cannot be more than the current number of volunteers, remove some volunteers and then reduce required number of volunteers.',
              );
            } else
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
