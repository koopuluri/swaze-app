import React, {Component} from 'react';
import {View, Text} from 'react-native';

class Home extends Component {
  render() {
    if (!this.props.user) return null;
    return (
      <View style={{marginTop: 100}}>
        <Text>{this.props.user.firstName + ' is logged in!'}</Text>
      </View>
    );
  }
}

export default Home;
