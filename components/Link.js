import React from 'react';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Text, Linking, StyleSheet} from 'react-native';

export default function Link(props) {
  return (
    <TouchableHighlight
      underlayColor="white"
      onPress={() =>
        Linking.canOpenURL(props.url) ? Linking.openURL(props.url) : null
      }
      style={{...props.style}}>
      <Text style={styles.linkText}>{props.name}</Text>
    </TouchableHighlight>
  );
}

styles = StyleSheet.create({
  linkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    opacity: 0.7,
  },
});
