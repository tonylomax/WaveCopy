import React from 'react';
import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import {ConfirmButton, CloseButton} from 'components';

export default function ChoicePopup({
  visible,
  setVisible,
  testID,
  yesAction,
  noAction,
  choiceText,
}) {
  return (
    <View testID={testID} style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {choiceText ? choiceText : 'Pick A Choice'}
            </Text>
            <ConfirmButton
              testID="yesButtonChoicePopup"
              title="Yes"
              onPress={() => {
                if (yesAction) yesAction();
                setVisible(false);
              }}></ConfirmButton>
            <CloseButton
              title="No"
              onPress={() => {
                setVisible(false);
              }}></CloseButton>
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
