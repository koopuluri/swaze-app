import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {getHumanReadableDateString} from '../UTIL';

export default function SessionListItem(props) {
  let {session} = props;
  let attendeesText = session.totalAttendees === 1 ? 'attendee' : 'attendees';
  let isPast = session.startTime.seconds < new Date() / 1000;
  return (
    <TouchableHighlight
      onPress={() => props.onPress()}
      activeOpacity={0.6}
      underlayColor="#d3d3d3">
      <View style={{...styles.container, opacity: isPast ? 0.55 : 1.0}}>
        <View style={styles.row}>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.attendees}>
            {session.totalAttendees + ' ' + attendeesText}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={styles.startTime}>
              {getHumanReadableDateString(
                new Date(session.startTime.seconds * 1000),
              )}
            </Text>
            <Text style={styles.price}>{'for $' + session.price}</Text>
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
    marginBottom: 6,
  },
  startTime: {
    marginRight: 5,
    color: 'gray',
    fontWeight: '400',
  },
  price: {color: 'gray'},
  totalMoney: {
    color: 'green',
    fontWeight: '400',
  },
  attendees: {
    color: 'gray',
  },

  container: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: '600',
    opacity: 0.8,
    fontSize: 16,
    color: '#4E0C6D',
  },
});
