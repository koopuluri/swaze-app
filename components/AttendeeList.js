import React, {Component} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import LoadingSpinner from './LoadingSpinner';

class AttendeeList extends Component {
  state = {
    attendees: [],
    isLoading: false,
  };

  componentDidMount() {
    let {sessionId, db} = this.props;
    // fetch attendees for this session:
    let unsubscribe = db
      .collection('sessions/' + sessionId + '/attendees')
      .orderBy('joinedAt')
      .onSnapshot(querySnapshot => {
        attendees = [];
        querySnapshot.forEach(doc => attendees.push(doc));
        this.setState({attendees: attendees});
      });
    this.setState({unsubscribe: unsubscribe});
  }

  componentWillUnmount = () =>
    this.state.unsubscribe ? this.state.unsubscribe() : null;

  render() {
    if (this.state.isLoading) return <LoadingSpinner />;
    let {attendees} = this.state;
    if (attendees.length === 0)
      return (
        <Text style={styles.message}>
          No one has paid to join this session yet.
        </Text>
      );
    return (
      <FlatList
        data={attendees}
        renderItem={item => {
          let attendee = item.item.data();
          return (
            <AttendeeListItem
              firstName={attendee.firstName}
              lastName={attendee.lastName}
              email={attendee.email}
              amountPaid={attendee.amountPaid}
            />
          );
        }}
      />
    );
  }
}

function AttendeeListItem(props) {
  let {firstName, lastName, email, amountPaid} = props;
  return (
    <View style={styles.listItemContainer}>
      <View>
        <Text style={styles.name}>{firstName + ' ' + lastName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <Text style={styles.amountPaid}>{'$ ' + amountPaid}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountPaid: {
    color: 'green',
    fontSize: 20,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
});

export default AttendeeList;
