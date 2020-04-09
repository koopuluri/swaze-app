import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {View, Text, StyleSheet} from 'react-native';

class Button extends Component {
  state = {
    isTouched: false,
  };
  render() {
    let props = this.props;
    let backgroundColor = props.backgroundColor
      ? props.backgroundColor
      : styles.container.backgroundColor;
    return (
      <TouchableHighlight
        underlayColor={props.underlayColor ? props.underlayColor : '#fbee54'}
        activeOpacity={0.5}
        onHideUnderlay={() => this.setState({isTouched: false})}
        onShowUnderlay={() => this.setState({isTouched: true})}
        style={{
          ...styles.container,
          backgroundColor: backgroundColor,
          shadowOffset: this.state.isTouched
            ? {width: 0, height: 0}
            : {width: 4, height: 4},
        }}
        onPress={props.onPress}>
        <Text
          style={{
            ...styles.label,
            color: props.textColor ? props.textColor : styles.label.color,
          }}>
          {props.title}
        </Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#550e8d',
  },
  container: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
    padding: 25,
    borderRadius: 8,
    backgroundColor: '#fbee54',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 4, height: 4},
  },
});

export default Button;
