import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import moment from 'moment';
import AttendeeList from '../components/AttendeeList';

class Session extends Component {
  state = {
    isLoading: true,
    session: null,
    error: '',
  };

  componentDidMount = async () => {
    let {db} = this.props;
    let id = this.props.route.params.id;
    db.collection('sessions')
      .doc(id)
      .onSnapshot(doc => {
        let data = doc.data();
        this.setState(
          {
            session: {
              ...data,
              startTime: moment(data.startTime.seconds * 1000).format(
                'MMMM Do YYYY, h:mm a',
              ),
              id: doc.id,
            },
            isLoading: false,
          },
          () => console.log('state: ', this.state.session.startTime),
        );
      });
  };

  render() {
    let {session, isLoading, error} = this.state;
    if (isLoading) return <LoadingSpinner />;
    if (!session) return null;
    return (
      <View style={styles.container}>
        {error ? <Text>{error}</Text> : null}
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.startTime}>{session.startTime}</Text>
        <Text style={styles.description}>{session.description}</Text>
        <Text style={styles.price}>{'$' + session.price}</Text>
        <AttendeeList sessionId={session.id} db={this.props.db} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 46,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  container: {
    textAlign: 'center',
    padding: 20,
    height: '100%',
    backgroundColor: 'white',
  },
  startTime: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    padding: 10,
  },
  price: {color: 'green', textAlign: 'center', fontSize: 40},
  sectionHeaderText: {
    fontSize: 24,
  },
});

export default Session;
