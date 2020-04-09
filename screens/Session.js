import React, {Component} from 'react';

import {View, Text, StyleSheet, Clipboard, Button} from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import moment from 'moment';
import AttendeeList from '../components/AttendeeList';

import {getUrlForSession} from '../UTIL';
import {TouchableHighlight} from 'react-native-gesture-handler';

import {deleteZoomMeeting} from '../api/zoom';

class Session extends Component {
  state = {
    isLoading: true,
    session: null,
    error: '',
    copied: false,
  };

  componentDidMount = async () => {
    let {db} = this.props;
    let id = this.props.route.params.id;
    let unsubscribe = db
      .collection('sessions')
      .doc(id)
      .onSnapshot(doc => {
        let data = doc.data();
        this.setState({
          session: {
            ...data,
            startTime: moment(data.startTime.seconds * 1000).format(
              'MMMM Do YYYY, h:mm a',
            ),
            id: doc.id,
          },
          isLoading: false,
        });
      });
    this.setState({unsubscribe: unsubscribe});
  };

  componentWillUnmount = () =>
    this.state.unsubscribe ? this.state.unsubscribe() : null;

  getUrlToCopy = () => {
    let {session, copied} = this.state;
    let url = getUrlForSession(session.id);
    return (
      <TouchableHighlight
        onPress={() => {
          Clipboard.setString(url);
          this.setState({copied: true});
        }}
        underlayColor="#d3d3d3"
        style={styles.url}>
        {!copied ? (
          <Text>{url}</Text>
        ) : (
          <Text style={{textAlign: 'center'}}>Copied url!</Text>
        )}
      </TouchableHighlight>
    );
  };

  delete = async () => {
    let {firebase, navigation} = this.props;
    let {session} = this.state;

    try {
      this.setState({isLoading: true});
      let userToken = await firebase.auth().currentUser.getIdToken(true);
      console.log(
        'attempting to delete zoomMeetingId: ',
        session.zoomMeetingId,
      );
      let resp = await deleteZoomMeeting(userToken, session.zoomMeetingId);
      console.log('zoom meeting successfully deleted: ', resp.data.id);

      this.state.unsubscribe();
      // deleting the firestore object:
      await firebase
        .firestore()
        .collection('sessions')
        .doc(session.id)
        .delete();

      console.log('session successfully deleted!');
      navigation.navigate('Home');
    } catch (e) {
      console.error('error deleting the session: ', e);
    }
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
        {this.getUrlToCopy()}
        <View style={styles.notify}>
          <Text style={styles.totalAttendees}>
            {session.totalAttendees + ' attendees'}
          </Text>
          <Text style={styles.totalMoney}>{'$' + session.totalMoney}</Text>
        </View>
        <Text style={styles.price}>
          {'$' + session.price + ' per attendee'}
        </Text>
        <Text style={styles.description}>{session.description}</Text>
        <View style={{marginTop: 40}}>
          <Text style={styles.label}>ATTENDEES</Text>
          <AttendeeList sessionId={session.id} db={this.props.db} />
        </View>
        {session.totalAttendees === 0 ? (
          <Button
            onPress={this.delete}
            title="Delete this session"
            color="red"
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  url: {
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 24,
  },
  notify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 8,
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 24,
    marginLeft: 40,
    marginRight: 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    elevation: 100,
  },

  totalAttendees: {
    fontSize: 20,
  },

  totalMoney: {fontSize: 20},

  label: {
    textAlign: 'center',
    fontSize: 20,
  },
  title: {
    fontSize: 46,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.85,
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
    opacity: 0.7,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  sectionHeader: {
    padding: 10,
  },
  price: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 15,
    opacity: 0.7,
  },
  sectionHeaderText: {
    fontSize: 24,
  },
});

export default Session;
