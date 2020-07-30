import React, {useEffect, useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {Card, Title, Paragraph, TextInput, Caption} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {
  updateOwnContactNumber,
  updateOwnBio,
  toggleIsNewUser,
  retrieveRegions,
  updateOwnRegion,
  requestNotificationPermission,
} from 'utils';
import {Picker} from '@react-native-community/picker';
import {ConfirmButton, LoadingScreen} from 'components';

export default function Onboarding({navigation}) {
  const dispatch = useDispatch();

  //LOCAL STATE
  const [contactNumber, setContactNumber] = useState();
  const [bio, setBio] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  //LOCAL STATE

  //REDUX STATE
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  const regions = useSelector((state) => state.firestoreReducer.regions);
  //REDUX STATE

  // useEffect(() => {
  //   console.log('region in onbordinng', regions);
  // }, [regions]);

  // useEffect(() => {
  //   console.log('selectedRegion', selectedRegion);
  // }, [selectedRegion]);

  useEffect(() => {
    retrieveRegions();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <LoadingScreen visible={loading} />
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
            <Caption> Tell us about yourself </Caption>
            <TextInput
              placeholder="About you"
              onChangeText={(bioInput) => {
                setBio(bioInput);
              }}></TextInput>
            <Caption> Provide an up to date contact number </Caption>
            <TextInput
              placeholder="Phone Number"
              onChangeText={(contactNumberInput) => {
                setContactNumber(contactNumberInput);
              }}></TextInput>
            <Caption>Confirm your region</Caption>

            <Picker
              selectedValue={selectedRegion}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedRegion(itemValue)
              }>
              {regions.map((region) => (
                <Picker.Item label={region.name} value={region.id} />
              ))}
            </Picker>
          </Card.Content>
        </Card>
        <ConfirmButton
          title="Go Home"
          onPress={() => {
            setLoading(true);
            updateOwnContactNumber(contactNumber, uid);
            updateOwnBio(bio, uid);
            updateOwnRegion(selectedRegion, uid);
            toggleIsNewUser(uid);
          }}></ConfirmButton>
      </View>
    </SafeAreaView>
  );
}
