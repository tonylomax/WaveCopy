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
} from '../../redux/';
import {LoadingScreen} from 'components';
import {subscribeToSessionChanges} from 'utils';

export default function Session({navigation, route}) {
  const dispatch = useDispatch();
  const {ID, AttendeesIDandAttendance, Mentors, MaxMentors} = route.params.item;
  const {selectedBeach} = route.params;

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

  //LOCAL STATE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (AttendeesIDandAttendance.length > 0) {
      dispatch(getAllSessionAttendees(AttendeesIDandAttendance));
    }
    dispatch(getAllSessionMentors(Mentors));
    console.log('max mentors is ', MaxMentors);
    const unsubscribe = subscribeToSessionChanges(ID);
    return () => {
      console.log('unsubscribing');
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (
      sessionData &&
      selectedSessionAttendeesData &&
      selectedSessionMentorsData
    ) {
      setLoading(false);
    }
  }, [sessionData, selectedSessionAttendeesData, selectedSessionMentorsData]);

  return (
    <View>
      {loading ? (
        <LoadingScreen visible={true}></LoadingScreen>
      ) : (
        <>
          <Image
            style={{height: '15%', width: '15%'}}
            source={Edit_Icon}></Image>
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
          <Text>{selectedBeach?.data?.Name}</Text>
          {selectedSessionAttendeesData &&
            selectedBeach &&
            MaxMentors > 0 &&
            selectedSessionMentorsData && (
              <AccordionMenu
                selectedUsers={selectedSessionAttendeesData}
                numberOfMentors={MaxMentors}
                location={selectedBeach}
                mentors={selectedSessionMentorsData}
              />
            )}
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
