import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import {Card, Title, Paragraph, Subheading} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {getAllBeaches} from '../../redux/';
import {isEmpty} from 'lodash';
import {
  subscribeToSessions,
  subscribeToRoleSpecificSessionChanges,
  getCoverImage,
} from 'utils';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {ConfirmButton} from 'components';

export default function Profile({navigation}) {
  const dispatch = useDispatch();

  //LOCAL STATE
  const [toggleFilter, setToggleFilter] = useState(false);

  //LOCAL STATE

  //REDUX STATE
  const sessions = useSelector((state) =>
    state.firestoreReducer.sessionData.sort((a, b) => {
      return new Date(a.DateTime) - new Date(b.DateTime);
    }),
  );
  const filteredSessions = useSelector((state) =>
    state.firestoreReducer.sessionData
      .filter((session) => {
        return session.Mentors.length !== session.MaxMentors;
      })
      .sort((a, b) => {
        return new Date(a.DateTime) - new Date(b.DateTime);
      }),
  );

  const filteredRoleSessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData
      .filter((session) => {
        return session.Mentors.length !== session.MaxMentors;
      })
      .sort((a, b) => {
        return new Date(a.DateTime) - new Date(b.DateTime);
      }),
  );

  const beaches = useSelector((state) => state.firestoreReducer.beaches);
  const roleSessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData.sort((a, b) => {
      return new Date(a.DateTime) - new Date(b.DateTime);
    }),
  );
  const userData = useSelector((state) => state.firestoreReducer.userData);
  //REDUX STATE

  const getBeach = (beachID) => {
    // console.log('all beaches', beaches);
    return beaches.filter((beach) => {
      // console.log(beachID);
      // console.log('beachin getbeach', beach);
      return beach.id === beachID;
    });
  };

  useEffect(() => {
    let unsubscribeFromSessions = () => {};
    let unsubscribeFromRoleSessions = () => {};
    // Check to see if there is user data
    if (!isEmpty(userData)) {
      //If the user is a national admin then set up a subscription too all sessions
      if (userData?.Roles.includes('NationalAdmin')) {
        // console.log('subscribing to all sessions', userData.Region);
        // console.log('current roles', userData.Roles);
        unsubscribeFromSessions = subscribeToSessions();
      } else {
        // Otherwise set up a subscription to sessions restricted to the users area

        // console.log('subscribing to role specific sessions', userData.Region);
        // console.log('current roles', userData.Roles);
        unsubscribeFromRoleSessions = subscribeToRoleSpecificSessionChanges(
          userData.Region,
        );
      }
      // Get the latest beach information
      dispatch(getAllBeaches());
      return () => {
        console.log('unsubscribing from sessions in home.js');
        unsubscribeFromSessions();
        unsubscribeFromRoleSessions();
      };
    }
  }, [userData]);

  // useEffect(() => {
  //   console.log('sessions in home', sessions);
  // }, [sessions]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, paddingBottom: 10}}>
        <Title testID="upcoming-sessions-title">Upcoming sessions</Title>
        <ConfirmButton
          title={
            toggleFilter
              ? 'Display all sessions'
              : 'Display only sessions with spaces'
          }
          onPress={() => {
            setToggleFilter((toggleFilter) => !toggleFilter);
          }}></ConfirmButton>
        <FlatList
          testID="SessionsList"
          data={
            userData?.Roles?.includes('NationalAdmin')
              ? toggleFilter
                ? filteredSessions
                : sessions
              : toggleFilter
              ? filteredRoleSessions
              : roleSessions
          }
          renderItem={({item}) => (
            <Card
              style={{padding: '5%', margin: '2%'}}
              elevation={2}
              id={item.ID}
              testID={`SessionsListItem${item.ID}`}
              onPress={() => {
                // console.log('this is the clicked thing ', item);
                const selectedBeach = getBeach(item.BeachID)[0];
                console.log('selectedBeach in home', selectedBeach);
                // const selectedBeach = item.Beach;
                // console.log({item});
                navigation.navigate('HomeSession', {item, selectedBeach});
              }}>
              <Card.Title
                title={
                  item?.Type === 'surf-club' ? 'Surf Club' : 'Surf Therapy'
                }
              />
              <Card.Content>
                <Paragraph>{item?.Beach}</Paragraph>
                <Paragraph>
                  {
                    <Moment element={Text} format="LLLL">
                      {item?.DateTime}
                    </Moment>
                  }
                </Paragraph>
                <Subheading testID={`SessionsListItemVolNum${item.ID}`}>
                  Volunteers: {item?.Mentors?.length}/{item?.MaxMentors}
                </Subheading>
              </Card.Content>

              <Card.Cover source={getCoverImage(item?.Beach)} />
            </Card>
          )}
          keyExtractor={(item) => item.ID}></FlatList>
      </View>
    </SafeAreaView>
  );
}
