import React from 'react';
import {TextInput, Text, View, StyleSheet} from 'react-native';

//https://stackoverflow.com/a/52749979 - for multiline height for ios.
export default function MyTextInput(props) {
  return (
    <View style={styles.container}>
      {props.title ? <Text style={styles.title}>{props.title}</Text> : null}
      <TextInput
        {...props}
        style={styles.input}
        numberOfLines={Platform.OS === 'ios' ? null : props.numberOfLines}
        minHeight={
          Platform.OS === 'ios' && props.numberOfLines
            ? 20 * props.numberOfLines
            : null
        }
      />
      {props.error ? (
        <Text style={styles.errorMessage}>{props.error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    marginBottom: 5,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginLeft: 10,
    marginTop: 2,
  },
});
