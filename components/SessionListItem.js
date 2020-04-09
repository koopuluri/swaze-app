import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import moment from 'moment';

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
              {moment(new Date(session.startTime.seconds * 1000)).format(
                'MMMM D, h:mm a',
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
    fontWeight: '600',
  },
  price: {color: 'gray'},
  totalMoney: {
    color: 'green',
    fontWeight: 'bold',
  },
  attendees: {
    color: 'gray',
  },

  container: {
    padding: 18,
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    opacity: 0.8,
  },
});
