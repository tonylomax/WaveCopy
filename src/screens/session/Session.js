import React, {useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {AccordionMenu, ConfirmButton} from 'components';
import {Edit_Icon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import Moment from 'react-moment';
import {getAllSessionAttendees} from '../../redux/';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  const {
    Beach,
    DateTime,
    Description,
    ID,
    Time,
    Type,
    CoordinatorID,
    MaxMentors,
    AttendeesIDandAttendance,
  } = route.params.item;

  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionAttendees,
  );

  useEffect(() => {
    dispatch(getAllSessionAttendees(AttendeesIDandAttendance));
  }, []);

  return (
    <View>
      <Image style={{height: '15%', width: '15%'}} source={Edit_Icon}></Image>
      <Moment element={Text} format="DD.MM.YY">
        {DateTime}
      </Moment>
      <Text>
        {Type}-{Beach}
      </Text>
      <Text>Coordinator: {CoordinatorID}</Text>
      <Text>{Description}</Text>
      <AccordionMenu title={`Mentors (0/${MaxMentors})`}></AccordionMenu>
      <AccordionMenu
        type="attendees"
        title={`Attendees (0/${AttendeesIDandAttendance.length})`}></AccordionMenu>
      <AccordionMenu type="location" title="Location"></AccordionMenu>
      <ConfirmButton
        title="Register"
        onPress={() => {
          navigation.navigate('Register', {
            Type,
            Beach,
            DateTime,
            selectedSessionAttendeesData,
            AttendeesIDandAttendance,
          });
        }}>
        Register
      </ConfirmButton>
    </View>
  );
}
