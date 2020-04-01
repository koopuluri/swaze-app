import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';

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
      .onSnapshot(doc =>
        this.setState({session: doc.data(), isLoading: false}),
      );

    try {
      let doc = await db
        .collection('sessions')
        .doc(id)
        .get();
      this.setState({
        session: doc.data(),
        isLoading: false,
      });
    } catch (e) {
      this.setState({isLoading: false, error: 'Failed to fetch session.'});
    }
  };

  render() {
    let {session, isLoading, error} = this.state;
    if (isLoading) return <LoadingSpinner />;
    if (!session) return null;
    return (
      <View>
        {error ? <Text>{error}</Text> : null}
        <Text style={styles.title}>{session.title}</Text>
        <Text stye={styles.startTime}>{session.startTime.seconds}</Text>
        <Text style={styles.description}>{session.description}</Text>
        <Text style={styles.price}>{session.price}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 46,
    fontWeight: 'bold',
  },
  startTime: {},
  description: {},
  sectionHeader: {
    padding: 10,
  },
  price: {color: 'green'},
  sectionHeaderText: {
    fontSize: 24,
  },
});

export default Session;
