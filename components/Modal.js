import React from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';

export default function SwazeModal(props) {
  return (
    <Modal isVisible={props.isVisible}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableHighlight
              style={{marginRight: 10}}
              onPress={() => props.close()}
              underlayColor="white">
              <Text style={{color: 'blue'}}>Cancel</Text>
            </TouchableHighlight>
            <Text style={styles.title}>{props.title}</Text>
          </View>
          {props.children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalView: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});
