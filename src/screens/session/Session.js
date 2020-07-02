import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {AccordionMenu, ConfirmButton} from 'components';
import {Edit_Icon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import Moment from 'react-moment';
import {
  getAllSessionAttendees,
  subscribeToSession,
  getAllSessionMentors,
  subscribeToBeach,
} from '../../redux/';
import {LoadingScreen} from 'components';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  const {ID, AttendeesIDandAttendance, Mentors} = route.params.item;

  //REDUX STATE
  const sessionData = useSelector(
    (state) => state.firestoreReducer.singleSession,
  );

  const selectedSessionAttendeesData = useSelector(
    (state) => state.firestoreReducer.selectedSessionAttendees,
  );

  const selectedSessionMentorsData = useSelector(
    (state) => state.firestoreReducer.selectedSessionMentors,
  );

  const beach = useSelector((state) => state.firestoreReducer.singleBeach);

  //LOCAL STATE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllSessionAttendees(AttendeesIDandAttendance));
    dispatch(subscribeToSession(ID));
    dispatch(getAllSessionMentors(Mentors));
  }, []);

  useEffect(() => {
    if (
      sessionData &&
      selectedSessionAttendeesData &&
      selectedSessionMentorsData
    ) {
      dispatch(subscribeToBeach(sessionData.BeachID));
      setLoading(false);
    }
  }, [sessionData, selectedSessionAttendeesData, selectedSessionMentorsData]);

  useEffect(() => {
    console.log('beach in sesssion', beach);
  }, [beach]);

  return (
    <View>
      {loading ? (
        <LoadingScreen visible={true}></LoadingScreen>
      ) : (
        <>
          <Image
            style={{height: '15%', width: '15%'}}
            source={Edit_Icon}></Image>
          <Text>{beach?.Name}</Text>
          <Moment element={Text} format="DD.MM.YY">
            {sessionData?.DateTime}
          </Moment>
          <Text>
            {sessionData?.Type}-{sessionData?.Beach}
          </Text>
          <Text>Coordinator: {sessionData?.CoordinatorID}</Text>
          <Text>{sessionData?.Description}</Text>
          {/* DATA TO BE ADDED INTO ACCORDION. */}
          <Text>{selectedSessionMentorsData[0]?.data?.firstName}</Text>
          <Text>{selectedSessionAttendeesData[0]?.data?.firstName}</Text>
          <Text>{beach?.Name}</Text>
          {/* <AccordionMenu
            type="mentors"
            data={selectedSessionMentorsData}
            title={`Mentors ${sessionData?.Mentors?.length}/${sessionData?.MaxMentors}`}></AccordionMenu>
          <AccordionMenu
            type="attendees"
            data={selectedSessionAttendeesData}
            title={`Attendees  ${sessionData?.Attendees?.length}`}></AccordionMenu>
          <AccordionMenu
            data={beach}
            type="location"
            title="Location"></AccordionMenu> */}
          <ConfirmButton
            title="Register"
            testID="registerButton"
            onPress={() => {
              navigation.navigate('Register', {
                ID,
              });
            }}>
            Register
          </ConfirmButton>
        </>
      )}
    </View>
  );
}
