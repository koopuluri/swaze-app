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
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{firstName + ' ' + lastName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <Text>{'$ ' + amountPaid}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AttendeeList;
