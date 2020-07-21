import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Edit_Icon} from 'assets';
import {Card, Title, Paragraph, TextInput} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {isEmpty} from 'lodash';
import {updateOwnContactNumber} from 'utils';

import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');
import {ConfirmButton} from 'components';

export default function Onboarding({navigation}) {
  const dispatch = useDispatch();

  //LOCAL STATE
  const [contactNumber, setContactNumber] = useState();
  const [editContactNumber, setEditContactNumber] = useState(false);
  const [bio, setBio] = useState();
  const [editBio, setEditBio] = useState(false);

  //LOCAL STATE

  //REDUX STATE

  //REDUX STATE

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, paddingBottom: 10}}>
        <Title testID="">Welcome to Wave</Title>
        <Paragraph>
          You can use this app to view details about all the sessions in your
          area and sign up for sessions.
        </Paragraph>

        <Paragraph>
          To get started we just need a few details from you.
        </Paragraph>

        {/* BIO CARD */}
        <Card style={{margin: '2%', maxHeight: 400}}>
          <Card.Content style={{padding: 10}}>
            <TextInput> </TextInput>
          </Card.Content>
        </Card>
        <ConfirmButton title="Go Home" onPress={() => {}}></ConfirmButton>
      </View>
    </SafeAreaView>
  );
}
