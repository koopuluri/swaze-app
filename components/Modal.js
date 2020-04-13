import React from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

// https://stackoverflow.com/a/36940904/2713471 - order of views matter when
// absolutely positioning
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
          <View>
            <Text style={styles.title}>{props.title}</Text>
            <Icon
              onPress={() => props.close()}
              style={{position: 'absolute'}}
              name="times-circle-o"
              size={24}
              color="gray"
            />
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
    backgroundColor: '#F1F2F6',
    borderRadius: 8,
  },
});
