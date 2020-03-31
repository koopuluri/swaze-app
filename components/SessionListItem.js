import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';

export default function SessionListItem(props) {
  let {session} = props;
  return (
    <TouchableHighlight
      onPress={() => props.onPress()}
      activeOpacity={0.6}
      underlayColor="#d3d3d3">
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.attendees}>
            {session.totalAttendees + ' attendees'}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={styles.startTime}>{session.startTime.seconds}</Text>
            <Text style={styles.price}>{'$' + session.price}</Text>
          </View>
          <Text style={styles.totalMoney}>{'$' + session.totalMoney}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  startTime: {
    marginRight: 5,
  },
  price: {},
  totalMoney: {
    color: 'green',
    fontWeight: 'bold',
  },
  attendees: {},

  container: {
    padding: 10,
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
  },
});
