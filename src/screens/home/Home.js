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
  const selectedSessionMentorsData = useSelector(
    (state) => state.firestoreReducer.selectedSessionSubscribedMentors,
  );
  const sessions = useSelector((state) =>
    state.firestoreReducer.sessionData
      .filter((session) => session.dateTime >= moment(new Date()).format())
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
  );
  const filteredSessions = useSelector((state) =>
    state.firestoreReducer.sessionData
      .filter((session) => {
        return session?.mentors?.length !== session.maxMentors;
      })
      .sort((a, b) => {
        return new Date(a.dateTime) - new Date(b.dateTime);
      }),
  );

  const filteredRoleSessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData
      .filter((session) => {
        console.log('session menotrs role specific ', session.mentors);
        return session?.mentors?.length !== session.maxMentors;
      })
      .sort((a, b) => {
        return new Date(a.dateTime) - new Date(b.dateTime);
      }),
  );

  const beaches = useSelector((state) => state.firestoreReducer.beaches);
  const roleSessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData.sort((a, b) => {
      return new Date(a.dateTime) - new Date(b.dateTime);
    }),
  );
  const userData = useSelector((state) => state.firestoreReducer.userData);
  //REDUX STATE

  const getBeach = (beachID) => {
    return beaches.find((beach) => beach.id === beachID);
  };

  useEffect(() => {
    let unsubscribeFromSessions = () => {};
    let unsubscribeFromRoleSessions = () => {};
    // Check to see if there is user data
    if (!isEmpty(userData)) {
      //If the user is a national admin then set up a subscription too all sessions
      if (userData?.roles.includes('NationalAdmin')) {
        unsubscribeFromSessions = subscribeToSessions();
      } else {
        // Otherwise set up a subscription to sessions restricted to the users area
        unsubscribeFromRoleSessions = subscribeToRoleSpecificSessionChanges(
          userData.region,
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
            userData?.roles?.includes('NationalAdmin')
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
              id={item.id}
              testID={`SessionsListItem${item.id}`}
              onPress={() => {
                const selectedBeach = getBeach(item.beachID);
                navigation.navigate('HomeSession', {item, selectedBeach});
              }}>
              <Card.Title
                title={
                  item?.type === 'surf-club' ? 'Surf Club' : 'Surf Therapy'
                }
              />
              <Card.Content>
                <Paragraph>{item?.beach}</Paragraph>
                <Paragraph>
                  {
                    <Moment element={Text} format="LLLL">
                      {item?.dateTime}
                    </Moment>
                  }
                </Paragraph>
                <Subheading testID={`SessionsListItemVolNum${item.id}`}>
                  Volunteers: {item?.mentors?.length}/{item?.maxMentors}
                </Subheading>
              </Card.Content>

              <Card.Cover source={getCoverImage(item?.beach)} />
            </Card>
          )}
          keyExtractor={(item) => item.id}></FlatList>
      </View>
    </SafeAreaView>
  );
}
