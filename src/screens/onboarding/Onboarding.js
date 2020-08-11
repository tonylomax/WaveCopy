import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  TextInput,
  Caption,
  Headline,
  Divider,
  Subheading,
  IconButton,
} from 'react-native-paper';
import {COLOURS} from 'styles';
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
  const [loading, setLoading] = useState(false);
  const [namedRegion, setNamedRegion] = useState();
  const [regionChevronIcon, setRegionChevronIcon] = useState('chevron-down');

  //LOCAL STATE
  useEffect(() => {
    console.log('showRegionPicker', showRegionPicker);
  }, [showRegionPicker]);

  //REDUX STATE
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  const regions = useSelector((state) => state.firestoreReducer.regions);
  //REDUX STATE

  useEffect(() => {
    retrieveRegions();
  }, []);

  useEffect(() => {
    setNamedRegion(regions[0]?.name);
  }, [regions]);

  useEffect(() => {
    const region = regions.find((region) => region.id === selectedRegion);
    setNamedRegion(region?.name);
  }, [selectedRegion]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <LoadingScreen visible={loading} />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View style={{flex: 1, paddingBottom: 10}}>
          {/* BIO CARD */}
          <Card style={{margin: '2%', maxHeight: '99%'}}>
            <ScrollView ref={(scrollView) => (this.scrollView = scrollView)}>
              <Card.Content style={{padding: 10}}>
                <Headline style={{alignSelf: 'center'}}>Welcome to</Headline>
                <Headline style={{alignSelf: 'center'}}>
                  The Wave Project
                </Headline>
                <Divider
                  style={{
                    borderColor: COLOURS.MINT,
                    width: '50%',
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 15,
                    marginTop: 15,
                    marginBottom: 15,
                  }}
                />
                <Paragraph style={{textAlign: 'center'}}>
                  You can use this app to view details about all the sessions in
                  your area and sign up for sessions.
                  {'\n'}
                </Paragraph>
                <Paragraph style={{textAlign: 'center'}}>
                  To get started we just need a few details from you.
                  {'\n'}
                </Paragraph>
                <Caption> Tell us about yourself </Caption>
                <TextInput
                  multiline={true}
                  style={{
                    multiline: 'true',
                    numberOfLines: 3,
                    flex: 1,

                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                  mode="outlined"
                  placeholder="About you..."
                  onChangeText={(bioInput) => {
                    setBio(bioInput);
                  }}></TextInput>
                <Caption style={{marginTop: 10}}>
                  Provide an up to date contact number
                </Caption>
                <TextInput
                  keyboardType="number-pad"
                  mode="outlined"
                  placeholder="Phone Number"
                  onChangeText={(contactNumberInput) => {
                    setContactNumber(contactNumberInput);
                  }}></TextInput>
                <Caption style={{marginTop: 10}}>Confirm your region</Caption>

                {Platform.OS === 'ios' && (
                  <TextInput
                    right={<TextInput.Icon name={regionChevronIcon} />}
                    mode="outlined"
                    placeholder="Region"
                    caretHidden={true}
                    value={namedRegion}
                    onFocus={() => {
                      setTimeout(() => {
                        this?.scrollView?.scrollToEnd();
                      }, 200);
                      setShowRegionPicker(
                        (showRegionPicker) => !showRegionPicker,
                      );
                      setRegionChevronIcon('chevron-up');
                    }}
                    onBlur={() => {
                      setShowRegionPicker(
                        (showRegionPicker) => !showRegionPicker,
                      );
                      setRegionChevronIcon('chevron-down');
                    }}></TextInput>
                )}

                {(showRegionPicker || Platform.OS === 'android') && (
                  <Picker
                    selectedValue={selectedRegion}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectedRegion(itemValue)
                    }>
                    {regions.map((region) => (
                      <Picker.Item label={region.name} value={region.id} />
                    ))}
                  </Picker>
                )}

                <ConfirmButton
                  style={{marginTop: 25}}
                  title="Continue"
                  onPress={() => {
                    setLoading(true);
                    toggleIsNewUser(uid);
                    updateOwnContactNumber(contactNumber, uid);
                    updateOwnBio(bio, uid);
                    updateOwnRegion(selectedRegion, uid);
                  }}></ConfirmButton>
              </Card.Content>
            </ScrollView>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
