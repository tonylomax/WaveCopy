import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Image, View} from 'react-native';
import {ConfirmButton} from 'components';
import {uploadProgress} from 'utils';

export default function ImageConfirmPopup({
  visible,
  setVisible,
  imgSource,
  yesAction,
}) {
  const [upload, setUpload] = useState({
    loading: false,
    progress: 0,
  });

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <Image
          style={{height: '25%', width: '25%'}}
          source={{uri: imgSource}}></Image>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to change your profile image?
            </Text>
            <ConfirmButton
              title="Yes"
              onPress={() => {
                if (yesAction) {
                  yesAction();
                }
                setVisible(false);
              }}></ConfirmButton>
            <ConfirmButton
              title="No"
              onPress={() => {
                setVisible(false);
              }}></ConfirmButton>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
